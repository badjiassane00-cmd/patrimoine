import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import { lodges } from "../data/content";

const TABS = ["Lodges éco-responsables", "Hôtels de charme", "Campements traditionnels", "Résidences balnéaires"];

export default function Hebergements() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <section className="bg-cream-dark py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
              <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
              HÉBERGEMENTS &amp; LODGES DU SÉNÉGAL
            </div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Séjournez au Cœur de la Teranga
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink/60">
            Du confort moderne des résidences balnéaires à l'authenticité
            préservée des campements traditionnels, vivez l'hospitalité
            unique du Sénégal.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-6 border-b border-ink/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-terracotta text-terracotta"
                  : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lodges.map((lodge) => (
            <article key={lodge.name} className="rounded-md bg-white/60">
              <PlaceholderImage
                label={lodge.name}
                src={lodge.image}
                alt={`Hébergement ou paysage associé à ${lodge.name}`}
                palette={lodge.palette}
                className="aspect-[4/3] w-full rounded-t-md"
              />
              <div className="p-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-terracotta">
                    <MapPin size={12} /> {lodge.location}
                  </span>
                  <span className="flex text-gold" aria-label={`${lodge.rating} étoiles sur 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < lodge.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                </div>
                <h3 className="font-display text-base text-ink">{lodge.name}</h3>
                <p className="mt-1 text-[11px] text-ink/50">PAR NUIT</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    à partir de {lodge.price}
                  </span>
                  <button className="rounded bg-terracotta px-3.5 py-1.5 text-xs font-semibold text-cream hover:bg-terracotta-dark">
                    Réserver
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
