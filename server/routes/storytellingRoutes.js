import { Router } from "express";

export function createStorytellingRoutes({ service, rateLimit, logger = console }) {
  const router = Router();

  router.get("/health", (_request, response) => response.json({ ok: true, configured: service.isConfigured }));

  router.post("/chat", rateLimit, async (request, response) => {
    const messages = Array.isArray(request.body?.messages) ? request.body.messages : [];
    const safeMessages = messages
      .filter((message) => ["user", "assistant"].includes(message.role) && typeof message.content === "string")
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 2000) }))
      .filter((message) => message.content);

    if (!safeMessages.length || safeMessages.at(-1).role !== "user") {
      return response.status(400).json({ error: "Le message est invalide." });
    }
    try {
      return response.json(await service.answer(safeMessages));
    } catch (error) {
      logger.error("Chat response failed:", error.message);
      return response.status(502).json({ error: "Le Griot ne peut pas répondre pour le moment. Réessayez dans un instant." });
    }
  });

  router.post("/story", rateLimit, async (request, response) => {
    const subject = String(request.body?.subject || "").trim().slice(0, 120);
    const tone = String(request.body?.tone || "enfant").trim();
    if (!subject) return response.status(400).json({ error: "Merci de préciser un sujet pour le récit." });
    try {
      return response.json(await service.generate(subject, tone));
    } catch (error) {
      logger.error("Story generation failed:", error.message);
      return response.status(502).json({ error: "Le Conteur est fatigué pour l'instant. Réessayez dans un instant." });
    }
  });

  return router;
}
