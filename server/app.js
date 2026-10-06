import cors from "cors";
import express from "express";
import { createRateLimit } from "./middleware/rateLimit.js";
import { createDatabase, createPushRepository, migrateDatabase } from "./infrastructure/database.js";
import { createContributionService } from "./services/contributionService.js";
import { createAuthService } from "./services/authService.js";
import { createAccountRoutes } from "./routes/accountRoutes.js";
import { trustedOrigin } from "./middleware/trustedOrigin.js";
import { mountStaticFrontend } from "./middleware/staticFrontend.js";
import { createPushRoutes } from "./routes/pushRoutes.js";
import { createStorytellingRoutes } from "./routes/storytellingRoutes.js";
import { createPushService } from "./services/pushService.js";
import { createStorytellingService } from "./services/storytellingService.js";
import { createQuizService } from "./services/quizService.js";
import { createQuizRoutes } from "./routes/quizRoutes.js";

export function createApp({ env = process.env, logger = console, storytellingService, pushService, database: injectedDatabase, authService, contributionService } = {}) {
  const app = express();
  const rateLimit = createRateLimit();
  const authRateLimit = createRateLimit({ limit: 8 });
  const contributionRateLimit = createRateLimit({ limit: 20 });
  const storytelling = storytellingService || createStorytellingService({
    apiKey: env.ANTHROPIC_API_KEY,
    model: env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
  });
  const database = injectedDatabase === undefined ? createDatabase({ connectionString: env.DATABASE_URL, ssl: env.DATABASE_SSL === "false" ? false : undefined }) : injectedDatabase;
  const push = pushService || createPushService({
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    contact: env.VAPID_CONTACT || "mailto:contact@teranga-patrimoine.sn",
    repository: createPushRepository(database),
  });
  if (database && !env.AUTH_SECRET) logger.warn("AUTH_SECRET absent : les espaces de comptes restent désactivés.");
  const auth = authService || (database && env.AUTH_SECRET ? createAuthService({ database, secret: env.AUTH_SECRET, secureCookies: env.NODE_ENV === "production" }) : null);
  const contributions = contributionService || (database ? createContributionService({ database }) : null);

  const allowedOrigin = env.CLIENT_ORIGIN || "http://localhost:5173";
  if (env.TRUST_PROXY) app.set("trust proxy", env.TRUST_PROXY);
  app.use(cors({ origin: allowedOrigin }));
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", createStorytellingRoutes({ service: storytelling, rateLimit, logger }));
  app.use("/api/push", createPushRoutes({ service: push, rateLimit }));
  app.use("/api/quiz", createQuizRoutes({ service: createQuizService({ database }) }));
  if (auth && contributions) app.use("/api", createAccountRoutes({ auth, contributions, authRateLimit, contributionRateLimit, checkOrigin: trustedOrigin(allowedOrigin) }));
  else {
    const accountsUnavailable = (_request, response) => response.status(503).json({ error: "Les espaces de comptes ne sont pas configurés. Configurez DATABASE_URL et AUTH_SECRET." });
    app.use("/api/auth", accountsUnavailable);
    app.use("/api/contributions", accountsUnavailable);
    app.use("/api/admin", accountsUnavailable);
  }
  app.use("/api", (_request, response) => response.status(404).json({ error: "Route API introuvable." }));
  mountStaticFrontend(app);
  app.use((error, _request, response, _next) => {
    logger.error("API request failed:", error.message);
    return response.status(error.status || 500).json({ error: error.status ? error.message : "Une erreur est survenue. Réessayez." });
  });

  const purgeTimer = setInterval(() => {
    rateLimit.purgeExpired();
    authRateLimit.purgeExpired();
    contributionRateLimit.purgeExpired();
  }, 5 * 60_000);
  purgeTimer.unref();
  app.locals.ready = migrateDatabase(database).then(async () => {
    if (auth) await auth.bootstrapAdmin({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD });
  });
  return app;
}
