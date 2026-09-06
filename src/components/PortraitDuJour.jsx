import { useMemo, useState } from "react";
import { CalendarHeart, Flame } from "lucide-react";
import { historicalFigures, mythicFigures } from "../data/content";
import PlaceholderImage from "./PlaceholderImage";
import LireAVoixHaute from "./LireAVoixHaute";
import PartagerBouton from "./PartagerBouton";

const STORAGE_KEY = "teranga_portraits_vus";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86_400_000);
}

function computeStreak(dates) {
  const set = new Set(dates);
  const cursor = new Date();
  let streak = 0;
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Met en avant une figure ou une légende différente chaque jour (calcul
 * déterministe, pas d'aléatoire) et suit, via le stockage local du
 * navigateur, le nombre de jours consécutifs où le visiteur est passé —
 * un léger ressort de fidélisation, sans aucune donnée envoyée à un serveur.
 */
export default function PortraitDuJour() {
  const pool = useMemo(
    () => [
      ...historicalFigures.map((figure) => ({ ...figure, kind: "Figure historique" })),
      ...mythicFigures.map((figure) => ({ ...figure, years: null, kind: "Légende & mémoire" })),
    ],
    []
  );

  const portrait = useMemo(() => pool[dayOfYear(new Date()) % pool.length], [pool]);

  // Lu et persisté directement à l'initialisation (pas dans un effet) : la
  // lecture est sans risque et l'écriture est idempotente (ajouter la date du
  // jour deux fois ne change rien), ce qui évite un rendu en cascade inutile.
  const [streak] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const dates = raw ? JSON.parse(raw) : [];
      const today = todayISO();
      const updated = dates.includes(today) ? dates : [...dates, today].slice(-90);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return computeStreak(updated);
    } catch {
      return 1;
    }
  });

  return (
    <section id="portrait-du-jour" className="border-y border-ink/10 bg-cream-dark/60 py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-center">
        <PlaceholderImage
          palette={portrait.palette}
          label={portrait.name}
          src={portrait.image}
          alt={`Portrait du jour : ${portrait.name}`}
          className="h-48 w-full shrink-0 rounded-md sm:w-64"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-terracotta">
              <CalendarHeart size={13} /> Portrait du jour · {portrait.kind}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-gold-dark">
                <Flame size={13} /> {streak} jours de découverte
              </span>
            )}
          </div>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{portrait.name}</h2>
          {portrait.years && <p className="mt-1 text-xs font-semibold text-ink/50">{portrait.years}</p>}
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">{portrait.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LireAVoixHaute text={`${portrait.name}. ${portrait.desc}`} className="border-terracotta text-terracotta" />
            <PartagerBouton
              title={`Téranga — Portrait du jour : ${portrait.name}`}
              text={`${portrait.name} — ${portrait.desc}`}
              label="Partager"
              className="border-ink/30 text-ink/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
