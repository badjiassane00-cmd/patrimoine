import pg from "pg";

const { Pool } = pg;

export const dbConfigured = Boolean(process.env.DATABASE_URL);

// La plupart des Postgres hébergés (Render, Railway, Neon, Supabase) exigent
// SSL mais fournissent un certificat auto-signé côté chaîne de confiance :
// on l'accepte tel quel, sauf en local où SSL n'a pas de sens.
export const pool = dbConfigured
    ? new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 10,
          connectionTimeoutMillis: 5_000,
          idleTimeoutMillis: 30_000,
          ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_SSL === "false"
              ? false
              : { rejectUnauthorized: false },
      })
    : null;

if (pool) {
    pool.on("error", (error) => {
        console.error("Erreur inattendue du pool PostgreSQL :", error.message);
    });
}

function toSubscriptionShape(row) {
    return { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } };
}

/**
 * Crée les tables si elles n'existent pas (idempotent, peut tourner à
 * chaque démarrage) puis amorce quiz_scores avec quelques lignes de
 * démonstration si la table est vide, pour que le classement ne soit pas
 * vide au tout premier lancement.
 */
export async function migrate() {
    if (!dbConfigured) {
        console.log("DATABASE_URL absent : le serveur fonctionne en mémoire (voir .env.example).");
        return;
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS push_subscriptions (
            endpoint TEXT PRIMARY KEY,
            p256dh TEXT NOT NULL,
            auth TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS quiz_scores (
            id SERIAL PRIMARY KEY,
            player_name TEXT NOT NULL,
            quiz_title TEXT NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);

    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM quiz_scores");
    if (rows[0].count === 0) {
        const seed = [
            ["Fatou Diop", "Quiz Culturel", 3, 3],
            ["Moussa Ndiaye", "Quiz d'Histoire", 3, 3],
            ["Khady Sow", "Quiz de Géographie", 3, 3],
            ["Abdoulaye Diallo", "Quiz de Géographie", 2, 3],
            ["Yacine Fall", "Quiz Culturel", 2, 3],
        ];
        for (const [playerName, quizTitle, score, total] of seed) {
            await pool.query(
                "INSERT INTO quiz_scores (player_name, quiz_title, score, total) VALUES ($1, $2, $3, $4)",
                [playerName, quizTitle, score, total]
            );
        }
        console.log("Table quiz_scores amorcée avec 5 scores de démonstration.");
    }

    console.log("Base de données prête (push_subscriptions, quiz_scores).");
}

export async function savePushSubscription(subscription) {
    const { endpoint, keys } = subscription;
    await pool.query(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
         VALUES ($1, $2, $3)
         ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
        [endpoint, keys?.p256dh, keys?.auth]
    );
}

export async function deletePushSubscription(endpoint) {
    await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
}

export async function getAllPushSubscriptions() {
    const { rows } = await pool.query("SELECT endpoint, p256dh, auth FROM push_subscriptions");
    return rows.map(toSubscriptionShape);
}

export async function getPushSubscriptionByEndpoint(endpoint) {
    const { rows } = await pool.query("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
    return rows.map(toSubscriptionShape);
}

export async function saveQuizScore({ playerName, quizTitle, score, total }) {
    await pool.query(
        "INSERT INTO quiz_scores (player_name, quiz_title, score, total) VALUES ($1, $2, $3, $4)",
        [playerName, quizTitle, score, total]
    );
}

export async function getLeaderboard(limit = 10) {
    const { rows } = await pool.query(
        `SELECT player_name, quiz_title, score, total, created_at
         FROM quiz_scores
         ORDER BY score DESC, created_at ASC
         LIMIT $1`,
        [limit]
    );
    return rows;
}
