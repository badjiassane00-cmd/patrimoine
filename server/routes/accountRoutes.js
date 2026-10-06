import { Router } from "express";
import { requireRole, requireUser } from "../middleware/authorization.js";

export function createAccountRoutes({ auth, contributions, authRateLimit, contributionRateLimit, checkOrigin }) {
  const router = Router();
  const authenticated = requireUser(auth);

  router.post("/auth/register", checkOrigin, authRateLimit, async (request, response, next) => {
    try {
      const user = await auth.register(request.body || {});
      auth.setSession(response, user);
      return response.status(201).json({ user });
    } catch (error) { return next(error); }
  });
  router.post("/auth/login", checkOrigin, authRateLimit, async (request, response, next) => {
    try { return response.json({ user: await auth.login(request.body || {}, response) }); }
    catch (error) { return next(error); }
  });
  router.post("/auth/logout", checkOrigin, (_request, response) => { auth.clearSession(response); return response.json({ ok: true }); });
  router.get("/auth/me", authenticated, (request, response) => response.json({ user: request.authUser }));

  router.get("/contributions", authenticated, async (request, response, next) => {
    try { return response.json({ contributions: await contributions.listForUser(request.authUser.sub) }); }
    catch (error) { return next(error); }
  });
  router.post("/contributions", checkOrigin, contributionRateLimit, authenticated, async (request, response, next) => {
    try { return response.status(201).json({ contribution: await contributions.submit(request.authUser.sub, request.body || {}) }); }
    catch (error) { return next(error); }
  });
  router.get("/admin/contributions", authenticated, requireRole("admin"), async (_request, response, next) => {
    try { return response.json({ contributions: await contributions.listForAdmin() }); }
    catch (error) { return next(error); }
  });
  router.patch("/admin/contributions/:id", checkOrigin, contributionRateLimit, authenticated, requireRole("admin"), async (request, response, next) => {
    try {
      if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Identifiant invalide." });
      return response.json({ contribution: await contributions.review(request.params.id, request.body?.status) });
    } catch (error) { return next(error); }
  });
  return router;
}
