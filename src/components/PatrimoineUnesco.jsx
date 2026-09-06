import { ArrowRight, Users } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { unescoSites } from "../data/content";

export default function PatrimoineUnesco() {
  return (
    <section className="bg-charcoal py-20 text-cream">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold">
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
          PATRIMOINE UNESCO &amp; TRADITIONS VIVANTES
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl">
          Notre Patrimoine, Notre Fierté
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/60">
          Découvrez la richesse historique et la ferveur culturelle du
          Sénégal à travers ses joyaux classés par l'UNESCO et ses
          traditions ancestrales toujours vivantes.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-6">
        <h3 className="mb-6 font-display text-2xl">Sites Classés au Patrimoine Mondial</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {unescoSites.map((site) => (
            <article key={site.title}>
              <PlaceholderImage
                label={site.title}
                src={site.image}
                alt={`Site UNESCO : ${site.title}`}
                palette={site.palette}
                className="aspect-square w-full rounded-md"
              />
              <span className="mt-3 inline-block rounded bg-cream/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gold">
                UNESCO
              </span>
              <h4 className="mt-1.5 font-display text-base">{site.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-cream/60">
                {site.desc}
              </p>
              <a href="#" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-terracotta">
                Découvrir le site
                <ArrowRight size={12} />
              </a>
            </article>
          ))}
        </div>

        <h3 className="mb-4 mt-14 font-display text-2xl">
          Traditions Vivantes &amp; Savoir-Faire
        </h3>
        <div className="flex items-center gap-4 rounded-md bg-cream/5 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream">
            <Users size={18} />
          </span>
          <div>
            <p className="font-display text-lg">Cérémonies Spirituelles</p>
            <p className="mt-0.5 text-sm text-cream/60">
              Ferveur collective du Magal de Touba, du Gamou et rituels
              mystiques du Kankurang masqué.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
