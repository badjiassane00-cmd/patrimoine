/**
 * Petits utilitaires pour que l'application se comporte comme une vraie
 * application mobile plutôt qu'un site web dans un cadre de téléphone.
 */

/** Retour haptique discret. Ne fait rien si l'appareil/navigateur ne le supporte pas. */
export function vibrate(pattern = 12) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Certains navigateurs refusent l'appel hors interaction utilisateur : sans conséquence.
  }
}

/** Détecte iOS/iPadOS pour proposer l'ajout à l'écran d'accueil (pas de beforeinstallprompt sur Safari). */
export function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isAppleTouch = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS13Plus = ua.includes("Macintosh") && typeof document !== "undefined" && "ontouchend" in document;
  return isAppleTouch || isIPadOS13Plus;
}

/** L'app tourne déjà en mode installé (standalone) ? */
export function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

/** Distance à vol d'oiseau en kilomètres entre deux coordonnées [lat, lng] (formule de Haversine). */
export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Lien universel d'itinéraire, fonctionne aussi bien pour ouvrir Plans (iOS)
 * que Google Maps (Android). Le paramètre `destination_place_id` de l'API
 * Google Maps attend un véritable identifiant de lieu Google (ex. "ChIJ...")
 * et non un nom libre : le passer ici était incorrect et pouvait empêcher
 * Maps de résoudre correctement la destination. On s'en tient donc aux
 * coordonnées, fiables dans tous les cas.
 */
export function itineraireUrl([lat, lng]) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
