export function requireUser(auth) {
  return (request, response, next) => {
    const user = auth?.currentUser(request);
    if (!user) return response.status(401).json({ error: "Connectez-vous pour accéder à cet espace." });
    request.authUser = user;
    return next();
  };
}

export function requireRole(role) {
  return (request, response, next) => {
    if (request.authUser?.role !== role) return response.status(403).json({ error: "Vous n'avez pas accès à cette page." });
    return next();
  };
}
