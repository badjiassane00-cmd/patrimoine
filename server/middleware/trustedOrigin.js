export function trustedOrigin(allowedOrigin) {
  return (request, response, next) => {
    const origin = request.get("origin");
    if (origin && origin !== allowedOrigin) return response.status(403).json({ error: "Origine de la requête non autorisée." });
    return next();
  };
}
