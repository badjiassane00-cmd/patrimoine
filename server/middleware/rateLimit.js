export function createRateLimit({ limit = 20, windowMs = 60_000, now = Date.now } = {}) {
  const clients = new Map();
  const middleware = (request, response, next) => {
    const timestamp = now();
    const recent = (clients.get(request.ip) || []).filter((entry) => timestamp - entry < windowMs);
    if (recent.length >= limit) return response.status(429).json({ error: "Trop de demandes. Réessayez dans une minute." });
    recent.push(timestamp);
    clients.set(request.ip, recent);
    return next();
  };

  middleware.purgeExpired = () => {
    const timestamp = now();
    for (const [ip, timestamps] of clients) {
      if (!timestamps.some((entry) => timestamp - entry < windowMs)) clients.delete(ip);
    }
  };
  return middleware;
}
