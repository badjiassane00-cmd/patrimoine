import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { vibrate } from "../lib/mobile";

/**
 * Ouvre la feuille de partage native du téléphone (Web Share API) quand elle
 * est disponible ; sinon copie le texte dans le presse-papiers. Pensé pour
 * partager un récit généré ou le portrait du jour vers WhatsApp, Messages...
 */
export default function PartagerBouton({ title, text, url, className = "", label = "Partager" }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    vibrate(10);
    const payload = { title, text, url: url || (typeof window !== "undefined" ? window.location.href : undefined) };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        // Partage annulé par l'utilisateur : rien à faire.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}${payload.url ? `\n\n${payload.url}` : ""}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible : on ignore silencieusement.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-1.5 rounded-full border border-current px-3.5 py-1.5 text-xs font-semibold transition-colors ${className}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? "Copié !" : label}
    </button>
  );
}
