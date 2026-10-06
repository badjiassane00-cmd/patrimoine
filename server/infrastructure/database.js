import pg from "pg";

const { Pool } = pg;

export function createDatabase({ connectionString = process.env.DATABASE_URL, ssl } = {}) {
  if (!connectionString) return null;
  const useSsl = ssl ?? (!connectionString.includes("localhost") && process.env.DATABASE_SSL !== "false");
  return new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    ...(useSsl ? { ssl: { rejectUnauthorized: true } } : {}),
  });
}

export async function migrateDatabase(database) {
  if (!database) return false;
  await database.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS contributions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      reviewed_at TIMESTAMPTZ
    );
    CREATE INDEX IF NOT EXISTS contributions_status_created_idx ON contributions(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS contributions_user_created_idx ON contributions(user_id, created_at DESC);
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      endpoint TEXT PRIMARY KEY,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS quiz_scores (
      id SERIAL PRIMARY KEY,
      player_name TEXT NOT NULL,
      quiz_title TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows } = await database.query("SELECT COUNT(*)::int AS count FROM quiz_scores");
  if (rows[0].count === 0) {
    const examples = [
      ["Fatou Diop", "Quiz Culturel", 3, 3],
      ["Moussa Ndiaye", "Quiz d'Histoire", 3, 3],
      ["Khady Sow", "Quiz de Géographie", 3, 3],
      ["Abdoulaye Diallo", "Quiz de Géographie", 2, 3],
      ["Yacine Fall", "Quiz Culturel", 2, 3],
    ];
    for (const values of examples) {
      await database.query("INSERT INTO quiz_scores (player_name, quiz_title, score, total) VALUES ($1, $2, $3, $4)", values);
    }
  }
  return true;
}

export function createPushRepository(database) {
  if (!database) return null;
  return {
    async save(subscription) {
      await database.query(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES ($1, $2, $3)
         ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
        [subscription.endpoint, subscription.keys?.p256dh, subscription.keys?.auth],
      );
    },
    async delete(endpoint) { await database.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]); },
    async find(endpoint) {
      const query = endpoint
        ? database.query("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE endpoint = $1", [endpoint])
        : database.query("SELECT endpoint, p256dh, auth FROM push_subscriptions");
      const { rows } = await query;
      return rows.map((row) => ({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }));
    },
  };
}
