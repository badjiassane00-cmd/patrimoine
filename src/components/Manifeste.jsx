import { useState } from "react";
import { BookOpen, HeartHandshake, Sparkles, X } from "lucide-react";

/**
 * Porte d'entrée narrative du site : un court manifeste qui pose l'intention
 * du projet avant l'exploration. Idée reprise de la direction "archive vivante"
 * et adaptée au système de design existant (couleurs, typographies, tons).
 */
export default function Manifeste() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded border border-cream/40 px-6 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:border-gold hover:text-gold"
      >
        <BookOpen size={16} />
        LIRE LE MANIFESTE
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/85 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="manifeste-title"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-ink p-8 text-cream shadow-2xl sm:p-10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le manifeste"
              className="absolute right-5 top-5 rounded-full p-1.5 text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              NOTRE MANIFESTE
            </div>

            <h2 id="manifeste-title" className="font-display text-3xl leading-tight sm:text-4xl">
              La mémoire devient un mouvement quand elle change de main.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-cream/78 sm:text-base">
              Téranga ne traite pas le patrimoine comme un objet figé. Chaque
              récit, chaque voix et chaque geste rassemblés ici invitent à
              écouter, comprendre et transmettre — pas seulement à consulter
              une archive.
            </p>

            <div className="mt-7 flex flex-col gap-3 border-t border-cream/10 pt-6 text-sm text-cream/70">
              <span className="flex items-center gap-2">
                <HeartHandshake size={17} className="text-gold" /> Respect des
                personnes et des contextes racontés
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={17} className="text-gold" /> La transmission
                avant la simple collection
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center gap-2 rounded bg-terracotta px-6 py-3 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-terracotta-dark"
            >
              Commencer l'exploration
            </button>
          </div>
        </div>
      )}
    </>
  );
}
