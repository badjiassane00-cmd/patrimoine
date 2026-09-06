import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { isIOS, isStandalone } from "../lib/mobile";

const DISMISS_KEY = "teranga-install-dismissed";

/**
 * Deux chemins d'installation, selon la plateforme :
 * - Android / Chrome desktop : l'événement natif "beforeinstallprompt" permet
 *   un vrai bouton "Installer".
 * - iOS Safari ne déclenche jamais cet événement : on affiche à la place le
 *   mode d'emploi (Partager → Sur l'écran d'accueil), sans quoi la moitié
 *   des visiteurs mobiles ne sauraient jamais que l'app est installable.
 * Le refus est mémorisé pour ne pas relancer la bannière à chaque visite.
 */
export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      // Stockage indisponible : on considère qu'il n'y a pas eu de refus.
    }
    if (dismissed) return;

    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setShowAndroid(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIOS()) {
      const timer = window.setTimeout(() => setShowIOS(true), 1500);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        window.clearTimeout(timer);
      };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Sans conséquence si indisponible.
    }
  };

  const install = async () => {
    await installEvent.prompt();
    dismiss();
  };

  if (showAndroid) {
    return (
      <div className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink p-3 text-cream shadow-2xl lg:bottom-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-ink"><Download size={19} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Installer Téranga</p>
          <p className="truncate text-xs text-cream/60">Gardez votre carnet de patrimoine avec vous.</p>
        </div>
        <button type="button" onClick={install} className="rounded-lg bg-terracotta px-3 py-2 text-xs font-semibold text-cream">Installer</button>
        <button type="button" onClick={dismiss} className="rounded p-1 text-cream/60 hover:text-cream" aria-label="Fermer la suggestion"><X size={16} /></button>
      </div>
    );
  }

  if (showIOS) {
    return (
      <div className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-ink p-4 text-cream shadow-2xl lg:bottom-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-ink"><SquarePlus size={19} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Installer Téranga sur cet iPhone</p>
          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs leading-relaxed text-cream/65">
            Appuyez sur <Share size={13} className="inline text-gold" aria-hidden="true" /> Partager, puis sur
            « Sur l'écran d'accueil ».
          </p>
        </div>
        <button type="button" onClick={dismiss} className="shrink-0 rounded p-1 text-cream/60 hover:text-cream" aria-label="Fermer la suggestion"><X size={16} /></button>
      </div>
    );
  }

  return null;
}
