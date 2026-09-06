export const OFFLINE_CACHE = "teranga-offline-media-v1";
const STATUS_KEY = "teranga_offline_pack";

export function getOfflinePackStatus() {
  try {
    const raw = window.localStorage.getItem(STATUS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setOfflinePackStatus(status) {
  try {
    window.localStorage.setItem(STATUS_KEY, JSON.stringify(status));
  } catch {
    // Stockage indisponible : le pack fonctionne quand même, seul le badge de statut disparaît.
  }
}

/**
 * Télécharge et met en cache (Cache Storage, la même API que le service
 * worker) une liste d'images. Comme le fetch passe par le service worker
 * déjà enregistré, ces images redeviendront disponibles hors-ligne sans
 * aucune autre configuration : sw.js les retrouvera via caches.match().
 */
export async function downloadOfflinePack(urls, onProgress) {
  if (!("caches" in window)) {
    throw new Error("Ce navigateur ne permet pas la mise en cache hors-ligne.");
  }
  const cache = await caches.open(OFFLINE_CACHE);
  let done = 0;
  let failed = 0;

  await Promise.all(
    urls.map(async (url) => {
      try {
        const already = await cache.match(url);
        if (!already) {
          const response = await fetch(url, { mode: "no-cors" });
          await cache.put(url, response);
        }
      } catch {
        failed += 1;
      } finally {
        done += 1;
        onProgress?.(done, urls.length);
      }
    })
  );

  const status = { count: urls.length - failed, total: urls.length, date: new Date().toISOString() };
  setOfflinePackStatus(status);
  return status;
}

export async function clearOfflinePack() {
  if ("caches" in window) await caches.delete(OFFLINE_CACHE);
  try {
    window.localStorage.removeItem(STATUS_KEY);
  } catch {
    // Rien à faire si le stockage local est indisponible.
  }
}
