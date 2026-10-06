export function createContributionService({ database }) {
  return {
    async submit(userId, { title, description }) {
      const cleanTitle = String(title || "").trim().slice(0, 160);
      const cleanDescription = String(description || "").trim().slice(0, 5000);
      if (cleanTitle.length < 3 || cleanDescription.length < 10) {
        throw Object.assign(new Error("Ajoutez un titre (3 caractères minimum) et une description (10 caractères minimum)."), { status: 400 });
      }
      const { rows } = await database.query(
        "INSERT INTO contributions (user_id, title, description) VALUES ($1, $2, $3) RETURNING id, title, description, status, created_at",
        [userId, cleanTitle, cleanDescription],
      );
      return rows[0];
    },
    async listForUser(userId) {
      const { rows } = await database.query(
        "SELECT id, title, description, status, created_at, reviewed_at FROM contributions WHERE user_id = $1 ORDER BY created_at DESC",
        [userId],
      );
      return rows;
    },
    async listForAdmin() {
      const { rows } = await database.query(
        `SELECT c.id, c.title, c.description, c.status, c.created_at, c.reviewed_at,
                u.id AS user_id, u.name AS user_name, u.email AS user_email
         FROM contributions c JOIN users u ON u.id = c.user_id
         ORDER BY CASE c.status WHEN 'pending' THEN 0 ELSE 1 END, c.created_at DESC`,
      );
      return rows;
    },
    async review(id, status) {
      if (!["approved", "rejected"].includes(status)) throw Object.assign(new Error("Statut de modération invalide."), { status: 400 });
      const { rows } = await database.query(
        "UPDATE contributions SET status = $1, reviewed_at = now() WHERE id = $2 RETURNING id, title, description, status, reviewed_at",
        [status, id],
      );
      if (!rows[0]) throw Object.assign(new Error("Contribution introuvable."), { status: 404 });
      return rows[0];
    },
  };
}
