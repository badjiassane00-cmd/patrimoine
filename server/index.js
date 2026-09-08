import "dotenv/config";
import cors from "cors";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import webpush from "web-push";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    dbConfigured,
    deletePushSubscription,
    getAllPushSubscriptions,
    getLeaderboard,
    getPushSubscriptionByEndpoint,
    migrate,
    savePushSubscription,
    saveQuizScore,
} from "./db.js";
import { siteKnowledge, storytellerPrompt } from "./knowledge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const clients = new Map();

// Stockage des souscriptions push en mémoire : suffisant pour une démo ou un
// petit déploiement, mais elles sont perdues au redémarrage du serveur. Pour
// une vraie production, remplacer cette Map par une table en base de données.
const pushSubscriptions = new Map();
const vapidConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
if (vapidConfigured) {
    webpush.setVapidDetails(
        process.env.VAPID_CONTACT || "mailto:contact@teranga-patrimoine.sn",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

function localAnswer(question) {
    const normalized = question
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    if (normalized.includes("griot")) {
        return "Dans les archives de Téranga, les griots sont les gardiens de la mémoire orale. Ils transmettent les histoires, les généalogies et les récits des royaumes par la parole et la musique. Explorez la section « La sagesse de la tradition orale » pour découvrir nos contes et notre documentaire.";
    }
    if (normalized.includes("lat dior")) {
        return "Lat Dior Ngoné Latir Diop (1842–1886) fut le Damel du Cayor. Il est présenté sur Téranga comme un souverain emblématique et un résistant acharné à la pénétration coloniale française. Consultez la section « Les Grandes Figures de notre Histoire ».";
    }
    if (normalized.includes("ou se trouve le senegal") || normalized.includes("situe le senegal") || normalized.includes("situe se le senegal")) {
        return "Le Sénégal se trouve en Afrique de l'Ouest, sur la façade atlantique. Il est bordé par la Mauritanie au nord, le Mali à l'est, la Guinée et la Guinée-Bissau au sud, et entoure presque entièrement la Gambie. Sur Téranga, vous pouvez parcourir ses régions grâce à la section « Voyage Géographique à travers l'Histoire ».";
    }
    if (normalized.includes("saint-louis") || normalized.includes("saint louis")) {
        return "Saint-Louis, ou Ndar, est une ancienne capitale située sur une île du fleuve Sénégal. Le site met en avant son architecture aux façades ocres, ses balcons en bois et son patrimoine mondial de l'UNESCO. Retrouvez-la dans « Voyage Géographique à travers l'Histoire ».";
    }
    if (normalized.includes("gorée") || normalized.includes("goree")) {
        return "L'île de Gorée est un lieu de mémoire au large de Dakar, associé à la Maison des Esclaves et classé au patrimoine mondial de l'UNESCO. Téranga propose une exposition dédiée : « L'Île de Gorée : Mémoire et Résilience ».";
    }
    if (normalized.includes("unesco") || normalized.includes("patrimoine")) {
        return "Téranga présente notamment l'île de Gorée, Saint-Louis, le Delta du Saloum, le Parc national du Djoudj et les Pays Bassari. Utilisez la carte interactive et le Passeport Patrimoine pour construire votre parcours.";
    }
    return "Je peux vous renseigner sur les contes, les griots, les grandes figures historiques, les sites UNESCO, les destinations et les expositions présents dans les archives de Téranga. Posez-moi une question plus précise.";
}

const TONE_LABELS = {
    enfant: "conte pour enfants, simple et malicieux",
    griot: "poème de griot, rythmé et oral",
    historique: "récit historique, sobre et documentaire",
    legende: "légende mystique, empreinte de mystère",
};

function localStory(subject, tone) {
    const styleLabel = TONE_LABELS[tone] || TONE_LABELS.enfant;
    const openings = [
        `On raconte, sous le grand fromager, qu'il faut parler de ${subject}.`,
        `Écoute bien, car voici ce que les anciens racontent au sujet de ${subject}.`,
        `Quand le tam-tam se tait à la tombée du jour, on évoque toujours ${subject}.`,
    ];
    const middles = [
        `Le vent du fleuve portait cette mémoire d'un village à l'autre, et chacun y ajoutait sa propre couleur.`,
        `Ni la pluie ni le temps n'ont réussi à effacer ce que ${subject} a laissé dans le cœur des Sénégalais.`,
        `Les femmes qui pilent le mil au crépuscule en parlent encore, entre deux chants.`,
    ];
    const closings = [
        "Ainsi parle la mémoire : ce qui est raconté ne meurt jamais tout à fait.",
        "Voilà ce que disent les anciens, et voilà ce que nous transmettons à notre tour.",
        "Et le conteur referma son récit, comme on referme doucement une calebasse pleine.",
    ];
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    return [
        pick(openings),
        `(récit généré hors-ligne, sans clé API — dans le style : ${styleLabel})`,
        "",
        pick(middles),
        "",
        pick(closings),
    ].join("\n");
}

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(distDir));

function rateLimit(request, response, next) {
    const now = Date.now();
    const key = request.ip;
    const recent = (clients.get(key) || []).filter((timestamp) => now - timestamp < 60_000);
    if (recent.length >= 20) return response.status(429).json({ error: "Trop de demandes. Réessayez dans une minute." });
    recent.push(now);
    clients.set(key, recent);
    return next();
}

// Sans cela, une entrée est créée pour chaque adresse IP vue au moins une
// fois et n'est jamais supprimée, même après une minute d'inactivité : sur un
// serveur qui tourne longtemps, cela grossit indéfiniment. On purge donc les
// IP inactives depuis plus d'une minute toutes les cinq minutes.
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of clients) {
        if (!timestamps.some((timestamp) => now - timestamp < 60_000)) {
            clients.delete(key);
        }
    }
}, 5 * 60_000).unref();

app.get("/api/health", (_request, response) => response.json({ ok: true, configured: Boolean(process.env.ANTHROPIC_API_KEY) }));

app.post("/api/chat", rateLimit, async (request, response) => {
    const messages = Array.isArray(request.body?.messages) ? request.body.messages : [];
    const safeMessages = messages
        .filter((message) => ["user", "assistant"].includes(message.role) && typeof message.content === "string")
        .slice(-12)
        .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 2000) }))
        .filter((message) => message.content);

    if (!safeMessages.length || safeMessages.at(-1).role !== "user") {
        return response.status(400).json({ error: "Le message est invalide." });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
        return response.json({ message: localAnswer(safeMessages.at(-1).content), mode: "local" });
    }

    try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const result = await anthropic.messages.create({
            model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
            max_tokens: 500,
            system: siteKnowledge,
            messages: safeMessages,
        });
        const text = result.content.find((block) => block.type === "text")?.text;
        return response.json({ message: text || "Je n'ai pas trouvé de réponse dans nos archives." });
    } catch (error) {
        console.error("Anthropic request failed:", error.message);
        return response.status(502).json({ error: "Le Griot ne peut pas répondre pour le moment. Réessayez dans un instant." });
    }
});

app.post("/api/story", rateLimit, async (request, response) => {
    const subject = String(request.body?.subject || "").trim().slice(0, 120);
    const tone = String(request.body?.tone || "enfant").trim();

    if (!subject) {
        return response.status(400).json({ error: "Merci de préciser un sujet pour le récit." });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
        return response.json({ story: localStory(subject, tone), mode: "local" });
    }

    try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const result = await anthropic.messages.create({
            model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
            max_tokens: 600,
            system: storytellerPrompt,
            messages: [{ role: "user", content: `Sujet : ${subject}\nTon souhaité : ${tone}` }],
        });
        const text = result.content.find((block) => block.type === "text")?.text;
        return response.json({ story: text || localStory(subject, tone) });
    } catch (error) {
        console.error("Story generation failed:", error.message);
        return response.status(502).json({ error: "Le Conteur est fatigué pour l'instant. Réessayez dans un instant." });
    }
});

app.get("/api/push/public-key", (_request, response) => {
    if (!vapidConfigured) return response.json({ configured: false });
    return response.json({ configured: true, publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.post("/api/push/subscribe", async (request, response) => {
    const subscription = request.body?.subscription;
    if (!subscription?.endpoint) {
        return response.status(400).json({ error: "Abonnement invalide." });
    }
    if (dbConfigured) {
        await savePushSubscription(subscription);
        return response.json({ ok: true });
    }
    pushSubscriptions.set(subscription.endpoint, subscription);
    return response.json({ ok: true, total: pushSubscriptions.size });
});

app.post("/api/push/unsubscribe", async (request, response) => {
    const endpoint = request.body?.endpoint;
    if (endpoint) {
        if (dbConfigured) await deletePushSubscription(endpoint);
        else pushSubscriptions.delete(endpoint);
    }
    return response.json({ ok: true });
});

app.post("/api/push/test", rateLimit, async (request, response) => {
    if (!vapidConfigured) {
        return response.status(503).json({ error: "Les notifications push ne sont pas configurées côté serveur (clés VAPID absentes)." });
    }
    const endpoint = request.body?.endpoint;
    const targets = dbConfigured
        ? await (endpoint ? getPushSubscriptionByEndpoint(endpoint) : getAllPushSubscriptions())
        : endpoint && pushSubscriptions.has(endpoint)
            ? [pushSubscriptions.get(endpoint)]
            : [...pushSubscriptions.values()];

    if (!targets.length) {
        return response.status(404).json({ error: "Aucun abonnement actif à notifier." });
    }

    const payload = JSON.stringify({
        title: "Téranga Patrimoine",
        body: "Un nouveau portrait du jour vous attend sur Téranga. Jërëjëf de votre fidélité !",
        url: "/#portrait-du-jour",
    });

    const results = await Promise.allSettled(targets.map((subscription) => webpush.sendNotification(subscription, payload)));
    const expired = [];
    results.forEach((result, index) => {
        if (result.status === "rejected" && [404, 410].includes(result.reason?.statusCode)) {
            expired.push(targets[index].endpoint);
        }
    });
    if (expired.length) {
        if (dbConfigured) await Promise.all(expired.map((endpointToRemove) => deletePushSubscription(endpointToRemove)));
        else expired.forEach((endpointToRemove) => pushSubscriptions.delete(endpointToRemove));
    }

    const sent = results.filter((result) => result.status === "fulfilled").length;
    return response.json({ ok: true, sent, failed: results.length - sent });
});

app.post("/api/quiz/score", async (request, response) => {
    const playerName = String(request.body?.playerName || "").trim().slice(0, 40);
    const quizTitle = String(request.body?.quizTitle || "").trim().slice(0, 60);
    const score = Number(request.body?.score);
    const total = Number(request.body?.total);
    if (!playerName || !quizTitle || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
        return response.status(400).json({ error: "Données de score invalides." });
    }
    if (!dbConfigured) {
        return response.status(503).json({ error: "Le classement en ligne n'est pas encore configuré (base de données absente)." });
    }
    await saveQuizScore({ playerName, quizTitle, score: Math.max(0, Math.min(score, total)), total });
    return response.json({ ok: true });
});

app.get("/api/quiz/leaderboard", async (_request, response) => {
    if (!dbConfigured) return response.json({ configured: false, leaderboard: [] });
    const leaderboard = await getLeaderboard(10);
    return response.json({ configured: true, leaderboard });
});

// Renvoie l'application React pour toute route qui n'est ni un fichier
// statique ni une route /api/* : indispensable pour que la navigation React
// Router fonctionne (ex. recharger directement /collections en production).
app.get(/^(?!\/api\/).*/, (_request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
});

migrate()
    .catch((error) => console.error("Échec de la migration de la base de données :", error.message))
    .finally(() => {
        app.listen(port, () => console.log(`Griot backend listening on http://localhost:${port}`));
    });