import { useState } from "react";
import { LocateFixed, Loader2, MapPinned, Navigation } from "lucide-react";
import { distanceKm, itineraireUrl, vibrate } from "../lib/mobile";

// Coordonnées reprises de la carte du patrimoine (CartePatrimoine.jsx), pour
// rester cohérent sans dupliquer toute la richesse de contenu de cette carte.
const SITES = [
  { id: "saint-louis", name: "Saint-Louis / Ndar", position: [16.0326, -16.4818], tag: "Patrimoine mondial UNESCO" },
  { id: "goree", name: "Île de Gorée", position: [14.6667, -17.4], tag: "Patrimoine mondial UNESCO" },
  { id: "niokolo-koba", name: "Niokolo-Koba", position: [13.0667, -12.7167], tag: "Réserve de biosphère" },
  { id: "dakar", name: "Dakar", position: [14.7167, -17.4677], tag: "Capitale culturelle" },
  { id: "saloum", name: "Delta du Saloum", position: [13.75, -16.5], tag: "Biodiversité UNESCO" },
  { id: "casamance", name: "Casamance", position: [12.5833, -16.2667], tag: "Terre de traditions" },
];

export default function PatrimoinePresDeMoi() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [nearest, setNearest] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorMsg("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const here = [coords.latitude, coords.longitude];
        const ranked = SITES.map((site) => ({ ...site, km: distanceKm(here, site.position) })).sort((a, b) => a.km - b.km);
        setNearest(ranked);
        setStatus("done");
        vibrate(15);
      },
      (error) => {
        setStatus("error");
        setErrorMsg(
          error.code === error.PERMISSION_DENIED
            ? "Autorisez la localisation dans les réglages de votre navigateur pour utiliser cette fonction."
            : "Impossible d'obtenir votre position pour le moment."
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  };

  return (
    <section id="pres-de-moi" className="mx-auto max-w-7xl px-6 py-14">
      <div className="rounded-lg border border-ink/10 bg-white/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
              <span className="h-px w-8 bg-terracotta" aria-hidden="true" /> AUTOUR DE VOUS
            </div>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">Patrimoine près de moi</h2>
            <p className="mt-2 max-w-xl text-sm text-ink/60">
              Où que vous soyez au Sénégal, découvrez le site patrimonial le plus proche et
              lancez l'itinéraire directement dans votre application de plans.
            </p>
          </div>
          <button
            type="button"
            onClick={locate}
            disabled={status === "loading"}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta-dark disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
            {status === "loading" ? "Localisation..." : status === "done" ? "Actualiser ma position" : "Me localiser"}
          </button>
        </div>

        {status === "error" && (
          <p className="mt-5 rounded border border-terracotta/30 bg-terracotta/5 p-4 text-sm text-terracotta">{errorMsg}</p>
        )}

        {status === "done" && nearest && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearest.slice(0, 3).map((site, index) => (
              <div
                key={site.id}
                className={`rounded-md border p-4 ${index === 0 ? "border-terracotta bg-terracotta/5" : "border-ink/10 bg-white/70"}`}
              >
                {index === 0 && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cream">
                    <MapPinned size={11} /> Le plus proche
                  </span>
                )}
                <h3 className="font-display text-lg text-ink">{site.name}</h3>
                <p className="mt-0.5 text-xs text-ink/50">{site.tag}</p>
                <p className="mt-2 text-sm font-semibold text-ink/70">≈ {Math.round(site.km)} km</p>
                <a
                  href={itineraireUrl(site.position)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => vibrate(10)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-terracotta-dark"
                >
                  <Navigation size={13} /> Itinéraire
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
