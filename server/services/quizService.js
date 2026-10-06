export function createQuizService({ database }) {
  return {
    configured: Boolean(database),
    async saveScore(payload) {
      const playerName = String(payload?.playerName || "").trim().slice(0, 40);
      const quizTitle = String(payload?.quizTitle || "").trim().slice(0, 60);
      const score = Number(payload?.score);
      const total = Number(payload?.total);
      if (!playerName || !quizTitle || !Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
        throw Object.assign(new Error("Données de score invalides."), { status: 400 });
      }
      if (!database) throw Object.assign(new Error("Le classement en ligne n'est pas encore configuré (base de données absente)."), { status: 503 });
      await database.query(
        "INSERT INTO quiz_scores (player_name, quiz_title, score, total) VALUES ($1, $2, $3, $4)",
        [playerName, quizTitle, Math.max(0, Math.min(score, total)), total],
      );
      return { ok: true };
    },
    async leaderboard(limit = 10) {
      if (!database) return { configured: false, leaderboard: [] };
      const { rows } = await database.query(
        `SELECT player_name, quiz_title, score, total, created_at FROM quiz_scores
         ORDER BY score DESC, created_at ASC LIMIT $1`,
        [limit],
      );
      return { configured: true, leaderboard: rows };
    },
  };
}
