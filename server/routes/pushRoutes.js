import { Router } from "express";

export function createPushRoutes({ service, rateLimit }) {
  const router = Router();
  router.get("/public-key", (_request, response) => response.json(service.configured ? { configured: true, publicKey: service.publicKey } : { configured: false }));
  router.post("/subscribe", async (request, response, next) => {
    const subscription = request.body?.subscription;
    if (!subscription?.endpoint) return response.status(400).json({ error: "Abonnement invalide." });
    try {
      const total = await service.subscribe(subscription);
      return response.json(total === null ? { ok: true } : { ok: true, total });
    } catch (error) { return next(error); }
  });
  router.post("/unsubscribe", async (request, response, next) => {
    try {
      if (request.body?.endpoint) await service.unsubscribe(request.body.endpoint);
      return response.json({ ok: true });
    } catch (error) { return next(error); }
  });
  router.post("/test", rateLimit, async (request, response) => {
    if (!service.configured) return response.status(503).json({ error: "Les notifications push ne sont pas configurées côté serveur (clés VAPID absentes)." });
    const result = await service.sendTest(request.body?.endpoint);
    if (!result.total) return response.status(404).json({ error: "Aucun abonnement actif à notifier." });
    return response.json({ ok: true, sent: result.sent, failed: result.failed });
  });
  return router;
}
