import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

/**
 * Bouton de narration vocale à poser à côté de n'importe quel texte
 * (biographie, conte, récit généré). S'auto-masque si le navigateur ne
 * supporte pas la synthèse vocale plutôt que d'afficher un bouton mort.
 */
export default function LireAVoixHaute({ text, label = "Écouter", className = "" }) {
  const { toggle, speaking, supported } = useSpeech();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => toggle(text)}
      aria-pressed={speaking}
      className={`inline-flex items-center gap-1.5 rounded-full border border-current px-3.5 py-1.5 text-xs font-semibold transition-colors ${className}`}
    >
      {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
      {speaking ? "Arrêter la lecture" : label}
    </button>
  );
}
