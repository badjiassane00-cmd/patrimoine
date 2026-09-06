import {
  contes,
  destinations,
  events,
  expositions,
  historicalFigures,
  lodges,
  mythicFigures,
  snapshots,
  unescoSites,
  videos,
} from "./content";

/**
 * Rassemble les visuels des principales sections du site (hors vidéos, trop
 * lourdes pour un pack hors-ligne). Ce sont ces images précisément qui ne
 * sont PAS mises en cache par la navigation normale, car elles proviennent
 * d'hébergeurs externes (Unsplash, Wikimedia) et non du même domaine.
 */
export function getOfflineImageUrls() {
  const urls = [
    ...expositions.map((item) => item.image),
    ...videos.map((item) => item.poster),
    contes.featured?.image,
    ...contes.list.map((item) => item.image),
    ...mythicFigures.map((item) => item.image),
    ...historicalFigures.map((item) => item.image),
    ...snapshots.map((item) => item.image),
    ...destinations.map((item) => item.image),
    ...lodges.map((item) => item.image),
    ...unescoSites.map((item) => item.image),
    ...events.map((item) => item.image),
  ];
  return [...new Set(urls.filter(Boolean))];
}
