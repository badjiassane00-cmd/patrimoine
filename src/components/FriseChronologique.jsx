import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";

const ERAS = [
  {
    period: "Avant le XIe siècle",
    title: "Royaumes fondateurs",
    desc: "Les premières organisations politiques structurent le territoire, dont le Tekrour le long du fleuve Sénégal, berceau d'échanges et de premières conversions à l'islam.",
    figures: ["Njaay, ancêtre mythique et souverain fondateur"],
  },
  {
    period: "XIIIe – XIXe siècle",
    title: "L'âge des royaumes",
    desc: "Djolof, Cayor, Walo, Baol, Sine, Saloum et l'Empire toucouleur structurent la vie politique, avec leurs cours, leurs griots et leurs cavaliers.",
    figures: ["Lat Dior Ngoné Latir Diop", "El Hadj Omar Tall", "Samba Linguère"],
  },
  {
    period: "1444 – 1848",
    title: "Comptoirs et traite atlantique",
    desc: "Gorée et Saint-Louis deviennent des comptoirs européens. L'île de Gorée porte aujourd'hui la mémoire universelle de la traite négrière.",
    figures: ["Île de Gorée", "Saint-Louis / Ndar"],
  },
  {
    period: "1854 – 1960",
    title: "Colonisation française",
    desc: "Le Sénégal devient le centre administratif de l'Afrique-Occidentale française. Résistances armées et spirituelles s'organisent face à la conquête.",
    figures: ["Cheikh Ahmadou Bamba", "Aline Sitoé Diatta", "Blaise Diagne"],
  },
  {
    period: "1960",
    title: "Indépendance",
    desc: "Le 20 août 1960, le Sénégal proclame son indépendance. Léopold Sédar Senghor en devient le premier président.",
    figures: ["Léopold Sédar Senghor"],
  },
  {
    period: "1960 — aujourd'hui",
    title: "Sénégal contemporain",
    desc: "Recherche panafricaine, essor culturel, diaspora et transformation numérique redessinent le rapport du pays à son propre patrimoine.",
    figures: ["Cheikh Anta Diop", "Une nouvelle génération de conteurs"],
  },
];

export default function FriseChronologique() {
  const [active, setActive] = useState(0);
  const era = ERAS[active];

  return (
    <section id="frise-chronologique" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
        <span className="h-px w-8 bg-terracotta" aria-hidden="true" /> FRISE CHRONOLOGIQUE
      </div>
      <h2 className="font-display text-3xl text-ink sm:text-4xl">Six siècles en un seul geste</h2>
      <p className="mt-3 max-w-2xl text-sm text-ink/60">
        Faites glisser le curseur d'époque en époque : chaque étape relie un contexte historique
        à des figures que vous pouvez ensuite explorer dans les Grandes Figures ou Le Conteur.
      </p>

      <div className="relative mt-14">
        <div className="absolute left-0 right-0 top-[13px] h-0.5 bg-ink/10" aria-hidden="true" />
        <motion.div
          className="absolute left-0 top-[13px] h-0.5 bg-terracotta"
          initial={{ width: 0 }}
          animate={{ width: `${(active / (ERAS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-3 gap-3 sm:grid-cols-6">
          {ERAS.map((item, index) => (
            <button
              key={item.period}
              type="button"
              onClick={() => setActive(index)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  index === active
                    ? "border-terracotta bg-terracotta text-cream"
                    : index < active
                      ? "border-terracotta bg-cream text-terracotta"
                      : "border-ink/20 bg-cream text-ink/40"
                }`}
              >
                {index + 1}
              </span>
              <span className={`hidden text-[11px] font-semibold sm:block ${index === active ? "text-ink" : "text-ink/45"}`}>
                {item.period}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.article
        key={era.period}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-10 rounded-lg border border-ink/10 bg-white/60 p-7 sm:p-9"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{era.period}</p>
        <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{era.title}</h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">{era.desc}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {era.figures.map((figure) => (
            <span key={figure} className="flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest">
              <Landmark size={12} /> {figure}
            </span>
          ))}
        </div>
      </motion.article>
    </section>
  );
}
