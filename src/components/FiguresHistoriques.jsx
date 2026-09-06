import { useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import LireAVoixHaute from "./LireAVoixHaute";
import PartagerBouton from "./PartagerBouton";
import { historicalFigures } from "../data/content";

export default function FiguresHistoriques() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const visibleFigures = historicalFigures.filter((figure) => {
    const searchable = `${figure.name} ${figure.role} ${figure.years} ${figure.desc}`.toLowerCase();
    return searchable.includes(query.toLowerCase());
  });

  return (
    <section id="figures-historiques" className="bg-cream-dark py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta">
            TERANGA PATRIMOINE SÉNÉGAL
          </p>
          <div className="my-4 flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-px w-10 bg-ink/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-px w-10 bg-ink/20" />
          </div>
          <h2 className="font-display text-4xl text-ink">
            Les Grandes Figures de notre Histoire
          </h2>
          <p className="mt-3 text-ink/60">
            Héros, résistants et bâtisseurs du Sénégal
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/60">{visibleFigures.length} figure{visibleFigures.length > 1 ? "s" : ""} dans la collection</p>
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Rechercher une figure historique</span>
            <Search size={16} className="absolute left-3 top-3 text-ink/40" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded border border-ink/15 bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40" placeholder="Nom, rôle ou période..." />
          </label>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFigures.map((figure) => (
            <article
              key={figure.name}
              className="overflow-hidden rounded-md bg-ink text-cream"
            >
              <div className="relative">
                <PlaceholderImage
                  palette={figure.palette}
                  label={figure.name}
                  src={figure.image}
                  alt={`Portrait illustré de ${figure.name}`}
                  className="aspect-[4/3] w-full"
                />
                <span className="absolute bottom-3 left-3 rounded bg-terracotta px-2.5 py-1 text-xs font-semibold">
                  {figure.years}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg">{figure.name}</h3>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-gold">
                  {figure.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  {figure.desc}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(figure)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cream"
                >
                  Découvrir son histoire
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
        {visibleFigures.length === 0 && <p className="mt-10 rounded border border-ink/10 bg-white/50 p-8 text-center text-sm text-ink/60">Aucune figure ne correspond à votre recherche.</p>}

        <div className="mt-10 flex justify-center">
          <span className="rounded-full border border-ink/15 px-5 py-2.5 text-xs text-ink/60">
            Exposition virtuelle enrichie · Archive Nationale du Sénégal
          </span>
        </div>
      </div>
      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label={selected.name}><div className="relative max-w-lg rounded bg-cream p-7 text-ink"><button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{selected.role}</p><h3 className="mt-3 font-display text-3xl">{selected.name}</h3><p className="mt-1 text-sm font-semibold text-gold-dark">{selected.years}</p><p className="mt-4 text-sm leading-relaxed text-ink/70">{selected.desc}</p><div className="mt-5 border-l-2 border-gold pl-4 text-sm italic text-ink/60">Une figure majeure de la mémoire et de la construction du Sénégal.</div><div className="mt-6 flex flex-wrap items-center gap-3"><LireAVoixHaute text={`${selected.name}, ${selected.role}. ${selected.desc}`} className="border-terracotta text-terracotta" /><PartagerBouton title={`Téranga — ${selected.name}`} text={`${selected.name} (${selected.years}) — ${selected.role}. ${selected.desc}`} className="border-ink/30 text-ink/60" /><button type="button" onClick={() => setSelected(null)} className="rounded bg-forest px-4 py-2.5 text-sm font-semibold text-cream">Fermer la biographie</button></div></div></div>}
    </section>
  );
}
