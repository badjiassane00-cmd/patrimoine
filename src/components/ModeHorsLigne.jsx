import { useState } from "react";
import { CloudOff, Download, RefreshCcw, Trash2, Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { clearOfflinePack, downloadOfflinePack, getOfflinePackStatus } from "../lib/offlinePack";
import { getOfflineImageUrls } from "../data/offlineAssets";
import { vibrate } from "../lib/mobile";

/**
 * Fonctionnalité pensée pour la connectivité réelle au Sénégal : un seul
 * téléchargement met en cache (Cache Storage, via le service worker déjà
 * installé) les photographies des figures, sites et récits. Ensuite, en
 * zone blanche, avec peu de data ou en avion, tout ce contenu reste
 * consultable — sans compte, sans serveur, sans coût récurrent.
 */
export default function ModeHorsLigne() {
  const online = useOnlineStatus();
  const [status, setStatus] = useState(() => getOfflinePackStatus());
  const [progress, setProgress] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const urls = getOfflineImageUrls();

  const download = async () => {
    setDownloading(true);
    setError("");
    setProgress({ done: 0, total: urls.length });
    try {
      const result = await downloadOfflinePack(urls, (done, total) => setProgress({ done, total }));
      setStatus(result);
      vibrate([10, 40, 10]);
    } catch (err) {
      setError(err.message || "Le téléchargement a échoué. Réessayez avec une connexion stable.");
    } finally {
      setDownloading(false);
    }
  };

  const clear = async () => {
    await clearOfflinePack();
    setStatus(null);
    vibrate(10);
  };

  return (
    <section id="mode-hors-ligne" className="mx-auto max-w-7xl px-6 py-14">
      <div className="rounded-lg border border-ink/10 bg-white/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
              {online ? <Wifi size={14} /> : <WifiOff size={14} />}
              {online ? "Connecté" : "Hors-ligne — le contenu déjà téléchargé reste disponible"}
            </div>
            <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Emportez Téranga sans connexion</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
              Téléchargez une fois les photographies des figures, sites et récits pour continuer à les
              consulter en zone blanche, en voyage ou pour économiser vos données mobiles.
            </p>
          </div>
          <CloudOff size={32} className="hidden shrink-0 text-ink/15 sm:block" aria-hidden="true" />
        </div>

        {status && !downloading && (
          <p className="mt-5 text-sm font-semibold text-forest">
            ✓ {status.count} éléments disponibles hors-ligne · mis à jour le{" "}
            {new Date(status.date).toLocaleDateString("fr-FR")}
          </p>
        )}

        {downloading && progress && (
          <div className="mt-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-terracotta transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink/50">{progress.done} / {progress.total} éléments enregistrés</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-terracotta-dark disabled:opacity-50"
          >
            {downloading ? <RefreshCcw size={15} className="animate-spin" /> : <Download size={15} />}
            {downloading ? "Téléchargement..." : status ? "Mettre à jour le pack" : "Télécharger pour hors-ligne"}
          </button>
          {status && !downloading && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink/60 hover:border-ink/30"
            >
              <Trash2 size={14} /> Libérer l'espace
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
