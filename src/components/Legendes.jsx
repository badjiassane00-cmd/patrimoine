import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { mythicFigures, foundingTales } from "../data/content";

export default function Legendes() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="legendes" className="bg-charcoal py-20 text-cream">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] text-terracotta">
          TERANGA PATRIMOINE
        </p>

        <div
          className="my-6 overflow-hidden whitespace-nowrap"
          aria-hidden="true"
        >
          <div className="animate-marquee inline-block text-gold">
            {"▲ ▼ ".repeat(30)}
            <span className="inline-block w-0">{"▲ ▼ ".repeat(30)}</span>
          </div>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl">
          Les Gardiens de nos Légendes
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-cream/60">
          Plongez au cœur de l'imaginaire sénégalais à travers les récits
          transmis de génération en génération. Rencontrez les esprits,
          héros et figures épiques qui peuplent la mémoire de notre terre de
          Teranga.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-2xl">Contes &amp; Personnages Mythiques</h3>
          <a
            href="#legendes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream/80 hover:text-terracotta"
          >
            Découvrir les figures
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {mythicFigures.map((figure) => (
            <button type="button" key={figure.name} onClick={() => setSelected(figure)} className="text-left">
              <PlaceholderImage
                label={figure.name}
                src={figure.image}
                alt={figure.name}
                palette={figure.palette}
                className="aspect-[3/4] w-full rounded-md"
              />
              <h4 className="mt-3 font-display text-lg">{figure.name}</h4>
              <p className="text-[11px] font-semibold tracking-wide text-terracotta">
                {figure.role}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-cream/60">
                {figure.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-2xl">Légendes &amp; Récits Fondateurs</h3>
          <span className="text-sm text-cream/50">3 récits essentiels</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {foundingTales.map((tale) => (
            <button
              key={tale.title}
              type="button"
              onClick={() => setSelected(tale)}
              className="group flex items-center gap-4 rounded-md bg-cream/5 p-4 transition-colors hover:bg-cream/10"
            >
              <PlaceholderImage
                label={tale.title}
                src={tale.image}
                alt={tale.title}
                palette={tale.palette}
                className="h-16 w-24 shrink-0 rounded"
              />
              <div>
                <h4 className="font-display text-base text-gold">{tale.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-cream/60">
                  {tale.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label={selected.title || selected.name}>
        <div className="relative max-w-lg rounded bg-cream p-7 text-ink"><button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{selected.role || "Récit fondateur"}</p><h3 className="mt-3 font-display text-3xl">{selected.name || selected.title}</h3><p className="mt-4 text-sm leading-relaxed text-ink/70">{selected.desc}</p><button type="button" onClick={() => setSelected(null)} className="mt-6 rounded bg-forest px-4 py-2.5 text-sm font-semibold text-cream">Fermer la fiche</button></div>
      </div>}
    </section>
  );
}
