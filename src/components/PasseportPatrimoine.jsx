import { useState } from "react";
import { ArrowRight, BookOpen, Check, Compass, MapPin, Sparkles } from "lucide-react";
import { destinations, expositions, videos } from "../data/content";

const interests = [
  { id: "histoire", label: "Histoire", icon: BookOpen },
  { id: "nature", label: "Nature", icon: Compass },
  { id: "culture", label: "Culture", icon: Sparkles },
];

const recommendations = {
  histoire: { title: expositions[0].title, type: "Exposition à découvrir", href: "#expositions", image: expositions[0].image },
  nature: { title: destinations[2].title, type: "Destination recommandée", href: "#immersions", image: destinations[2].image },
  culture: { title: videos[0].title, type: "Documentaire conseillé", href: "#videotheque", image: videos[0].poster },
};

const defaultInterests = ["histoire", "culture"];

export default function PasseportPatrimoine() {
  const [selectedInterests, setSelectedInterests] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("teranga-interests"));
      return Array.isArray(stored) ? stored.filter((interest) => recommendations[interest]) : defaultInterests;
    } catch {
      return defaultInterests;
    }
  });
  const [visited, setVisited] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("teranga-visited")) || [];
    } catch {
      return [];
    }
  });

  const toggleInterest = (interest) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(next);
    try {
      localStorage.setItem("teranga-interests", JSON.stringify(next));
    } catch {
      // Stockage indisponible : la sélection reste active pour la session en cours.
    }
  };

  const markVisited = (title) => {
    if (visited.includes(title)) return;
    const next = [...visited, title];
    setVisited(next);
    try {
      localStorage.setItem("teranga-visited", JSON.stringify(next));
    } catch {
      // Stockage indisponible : l'étape reste validée pour la session en cours.
    }
  };

  return (
    <section id="passeport" className="bg-forest py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" /> VOTRE CARNET NUMÉRIQUE
            </div>
            <h2 className="font-display text-4xl sm:text-5xl">Le Passeport Patrimoine</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/70">
              Composez votre parcours, gardez la trace de vos découvertes et débloquez des étapes au fil de votre exploration.
            </p>
          </div>
          <div className="rounded-md border border-cream/15 bg-black/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">Vos affinités</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {interests.map(({ id, label, icon: Icon }) => {
                const active = selectedInterests.includes(id);
                return <button key={id} type="button" onClick={() => toggleInterest(id)} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${active ? "border-gold bg-gold text-ink" : "border-cream/25 text-cream hover:border-gold"}`}><Icon size={15} />{label}{active && <Check size={14} />}</button>;
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {selectedInterests.length > 0 ? selectedInterests.filter((interest) => recommendations[interest]).map((interest) => {
            const recommendation = recommendations[interest];
            const done = visited.includes(recommendation.title);
            return <article key={interest} className="overflow-hidden rounded-md bg-cream text-ink"><img src={recommendation.image} alt={recommendation.title} className="h-44 w-full object-cover" loading="lazy" /><div className="p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-terracotta">{recommendation.type}</p><h3 className="mt-2 font-display text-xl">{recommendation.title}</h3><button type="button" onClick={() => markVisited(recommendation.title)} className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${done ? "text-forest" : "text-terracotta"}`}>{done ? <><Check size={15} /> Étape validée</> : <>Ajouter à mon carnet <ArrowRight size={15} /></>}</button></div></article>;
          }) : <div className="rounded-md border border-dashed border-cream/30 p-8 text-sm text-cream/70 sm:col-span-2 lg:col-span-3">Sélectionnez un centre d’intérêt pour recevoir vos premières recommandations.</div>}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 pt-5 text-sm text-cream/70"><span className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {visited.length} étape{visited.length > 1 ? "s" : ""} validée{visited.length > 1 ? "s" : ""}</span><span>{visited.length >= 3 ? "Badge obtenu : Explorateur de la Teranga" : `${3 - visited.length} étape${3 - visited.length > 1 ? "s" : ""} avant votre premier badge`}</span></div>
      </div>
    </section>
  );
}
