import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { expositions } from "../data/content";

export default function Expositions() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="expositions" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
            <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
            EXPOSITIONS À LA UNE
          </div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Parcourez nos galeries thématiques
          </h2>
        </div>
        <a
          href="#expositions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-terracotta"
        >
          Toutes les expositions
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {expositions.map((expo) => (
          <article key={expo.title} className="group">
            <PlaceholderImage
              label={expo.title}
              src={expo.image}
              alt={expo.title}
              palette={expo.palette}
              className="aspect-[4/3] w-full rounded-t-md"
            />
            <div className="rounded-b-md border border-t-0 border-ink/10 bg-white/40 p-6">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-terracotta">
                {expo.tag}
              </p>
              <h3 className="font-display text-xl text-ink">{expo.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {expo.desc}
              </p>
              <button
                type="button"
                onClick={() => setSelected(expo)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta"
              >
                Découvrir l'exposition
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label={selected.title}><div className="relative max-w-lg rounded bg-cream p-7 text-ink"><button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{selected.tag}</p><h3 className="mt-3 font-display text-3xl">{selected.title}</h3><p className="mt-4 text-sm leading-relaxed text-ink/70">{selected.desc}</p><button type="button" onClick={() => setSelected(null)} className="mt-6 rounded bg-forest px-4 py-2.5 text-sm font-semibold text-cream">Entrer dans l’exposition</button></div></div>}
    </section>
  );
}
