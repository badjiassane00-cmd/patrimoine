import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const PASSWORD_BYTES = 64;
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) { return email.trim().toLowerCase(); }

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, PASSWORD_BYTES);
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

async function verifyPassword(password, encoded) {
  const [algorithm, salt, expectedHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export function createAuthService({ database, secret, secureCookies = process.env.NODE_ENV === "production" } = {}) {
  const signingSecret = secret || process.env.AUTH_SECRET;
  if (!signingSecret) throw new Error("AUTH_SECRET doit être configuré pour activer l'authentification.");
  if (Buffer.byteLength(signingSecret) < 32) throw new Error("AUTH_SECRET doit contenir au moins 32 octets aléatoires.");
  if (!database) throw new Error("DATABASE_URL doit être configuré pour activer les comptes.");

  function sign(payload) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", signingSecret).update(encoded).digest("base64url");
    return `${encoded}.${signature}`;
  }

  function readToken(request) {
    const cookie = request.headers.cookie?.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("teranga_session="));
    if (!cookie) return null;
    let token;
    try { token = decodeURIComponent(cookie.slice("teranga_session=".length)); }
    catch { return null; }
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expected = createHmac("sha256", signingSecret).update(encoded).digest();
    let actual;
    try { actual = Buffer.from(signature, "base64url"); } catch { return null; }
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    try {
      const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
      return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
    } catch { return null; }
  }

  function setSession(response, user) {
    const token = sign({ sub: user.id, id: user.id, name: user.name, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS });
    const secure = secureCookies ? "; Secure" : "";
    response.setHeader("Set-Cookie", `teranga_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}${secure}`);
  }

  return {
    currentUser(request) { return readToken(request); },
    async register({ name, email, password }) {
      const cleanName = String(name || "").trim().slice(0, 100);
      const cleanEmail = normalizeEmail(String(email || ""));
      if (cleanName.length < 2) throw Object.assign(new Error("Le nom doit contenir au moins 2 caractères."), { status: 400 });
      if (!EMAIL_PATTERN.test(cleanEmail) || cleanEmail.length > 254) throw Object.assign(new Error("Adresse e-mail invalide."), { status: 400 });
      if (typeof password !== "string" || password.length < 10 || password.length > 200) throw Object.assign(new Error("Le mot de passe doit contenir entre 10 et 200 caractères."), { status: 400 });
      try {
        const { rows } = await database.query(
          "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
          [cleanName, cleanEmail, await hashPassword(password)],
        );
        return publicUser(rows[0]);
      } catch (error) {
        if (error.code === "23505") throw Object.assign(new Error("Un compte utilise déjà cette adresse e-mail."), { status: 409 });
        throw error;
      }
    },
    async login({ email, password }, response) {
      const cleanEmail = normalizeEmail(String(email || ""));
      const { rows } = await database.query("SELECT id, name, email, role, password_hash FROM users WHERE email = $1", [cleanEmail]);
      if (!rows[0] || typeof password !== "string" || !(await verifyPassword(password, rows[0].password_hash))) {
        throw Object.assign(new Error("Adresse e-mail ou mot de passe incorrect."), { status: 401 });
      }
      const user = publicUser(rows[0]);
      setSession(response, user);
      return user;
    },
    setSession,
    clearSession(response) {
      const secure = secureCookies ? "; Secure" : "";
      response.setHeader("Set-Cookie", `teranga_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
    },
    async bootstrapAdmin({ email, password }) {
      if (!email || !password) return false;
      const cleanEmail = normalizeEmail(email);
      if (!EMAIL_PATTERN.test(cleanEmail) || String(password).length < 10) throw new Error("ADMIN_EMAIL valide et ADMIN_PASSWORD de 10 caractères minimum sont requis.");
      const name = cleanEmail.split("@")[0].slice(0, 100) || "Administrateur";
      await database.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = 'admin'`,
        [name, cleanEmail, await hashPassword(password)],
      );
      return true;
    },
  };
}
