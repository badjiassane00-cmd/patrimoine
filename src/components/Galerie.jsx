import { useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { snapshots } from "../data/content";

export default function Galerie() {
  const [activeIndex, setActiveIndex] = useState(null);
  const activeShot = activeIndex === null ? null : snapshots[activeIndex];

  const move = (step) => {
    setActiveIndex((current) => (current + step + snapshots.length) % snapshots.length);
  };

  return (
    <section id="galerie" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
            <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
            GALERIE PATRIMOINIALE
          </div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Instantanés de notre Mémoire Commune
          </h2>
        </div>
        <a
          href="#galerie"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-terracotta"
        >
          Voir toute la galerie
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:grid-rows-2">
        {snapshots.map((shot, index) => (
          <button
            key={shot.label}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative h-64 w-full overflow-hidden rounded-md text-left sm:h-72 ${
              shot.span === "lg" ? "sm:col-span-2" : "sm:col-span-1"
            }`}
          >
            <img src={shot.image} alt={shot.label} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-10 text-xs font-semibold tracking-wide text-white">{shot.label}</span>
          </button>
        ))}
      </div>

      {activeShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6" role="dialog" aria-modal="true" aria-label={activeShot.label}>
          <button type="button" onClick={() => setActiveIndex(null)} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Fermer la galerie"><X size={22} /></button>
          <button type="button" onClick={() => move(-1)} className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Image précédente"><ArrowLeft size={22} /></button>
          <figure className="max-h-[85vh] max-w-5xl text-center">
            <img src={activeShot.image} alt={activeShot.label} className="max-h-[75vh] w-auto rounded object-contain" />
            <figcaption className="mt-4 text-sm text-white/80">{activeShot.label}</figcaption>
          </figure>
          <button type="button" onClick={() => move(1)} className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Image suivante"><ArrowRight size={22} /></button>
        </div>
      )}
    </section>
  );
}
