import { Router } from "express";

export function createQuizRoutes({ service }) {
  const router = Router();
  router.post("/score", async (request, response, next) => {
    try { return response.json(await service.saveScore(request.body)); }
    catch (error) { return next(error); }
  });
  router.get("/leaderboard", async (_request, response, next) => {
    try { return response.json(await service.leaderboard()); }
    catch (error) { return next(error); }
  });
  return router;
}
