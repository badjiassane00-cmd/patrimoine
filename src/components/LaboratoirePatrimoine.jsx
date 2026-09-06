import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Headphones, Map, Volume2 } from "lucide-react";

const comparisons = [
  { place: "Saint-Louis / Ndar", date: "1905 → aujourd'hui", old: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85", current: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", text: "Une ville insulaire où les façades, le fleuve et la mémoire dialoguent encore." },
  { place: "Île de Gorée", date: "Hier → aujourd'hui", old: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=1200&q=85", current: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", text: "Un lieu de mémoire qui continue d'accueillir les récits du monde." },
];

const sounds = [
  { region: "Dakar", sound: "Le rythme du sabar", desc: "Percussions, danse et énergie de la capitale.", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { region: "Saint-Louis", sound: "Le souffle du fleuve", desc: "Une escale calme entre eau, vent et histoire.", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { region: "Casamance", sound: "La forêt après la pluie", desc: "Un paysage sonore inspiré des terres diola.", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const dailyChallenge = { question: "Quelle figure est connue comme le Damel du Cayor ?", answers: ["Lat Dior Ngoné Latir Diop", "Cheikh Anta Diop", "Léopold Sédar Senghor"], correct: "Lat Dior Ngoné Latir Diop" };

export default function LaboratoirePatrimoine() {
  const [comparisonIndex, setComparisonIndex] = useState(0);
  const [position, setPosition] = useState(52);
  const [soundIndex, setSoundIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const comparison = comparisons[comparisonIndex];
  const sound = sounds[soundIndex];
  const challengeState = useMemo(() => answer ? (answer === dailyChallenge.correct ? "correct" : "wrong") : "idle", [answer]);

  return (
    <section id="laboratoire" className="bg-charcoal py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl"><div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold"><span className="h-px w-8 bg-gold" /> EXPÉRIENCES INTERACTIVES</div><h2 className="font-display text-4xl sm:text-5xl">Le patrimoine en mouvement</h2><p className="mt-4 text-sm leading-relaxed text-cream/65">Comparez, écoutez et testez vos connaissances dans un laboratoire vivant de la mémoire sénégalaise.</p></div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="overflow-hidden rounded-md border border-cream/10 bg-cream/5"><div className="flex items-center justify-between gap-4 border-b border-cream/10 p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Avant / Aujourd'hui</p><h3 className="mt-1 font-display text-2xl">{comparison.place}</h3></div><span className="text-xs text-cream/50">{comparison.date}</span></div><div className="relative aspect-[16/9] overflow-hidden"><img src={comparison.old} alt={`${comparison.place}, archive historique`} className="absolute inset-0 h-full w-full object-cover grayscale" /><div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}><img src={comparison.current} alt={`${comparison.place}, vue actuelle`} className="h-full w-[calc(100vw-3rem)] max-w-none object-cover sm:w-[calc(70vw)] lg:w-[calc(55vw)]" /></div><div className="absolute inset-y-0 w-0.5 bg-gold shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${position}%` }}><span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink"><ChevronRight size={17} /></span></div><label className="absolute inset-x-5 bottom-4"><span className="sr-only">Comparer les époques</span><input type="range" min="0" max="100" value={position} onChange={(event) => setPosition(event.target.value)} className="w-full accent-gold" /></label><span className="absolute left-4 top-4 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">Aujourd'hui</span><span className="absolute right-4 top-4 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">Archive</span></div><div className="flex flex-wrap items-center justify-between gap-4 p-5"><p className="max-w-xl text-sm leading-relaxed text-cream/65">{comparison.text}</p><div className="flex gap-2"><button type="button" onClick={() => { setComparisonIndex((comparisonIndex + comparisons.length - 1) % comparisons.length); setPosition(52); }} className="rounded border border-cream/20 px-3 py-2 text-xs text-cream/70 hover:border-gold">Précédent</button><button type="button" onClick={() => { setComparisonIndex((comparisonIndex + 1) % comparisons.length); setPosition(52); }} className="rounded bg-gold px-3 py-2 text-xs font-semibold text-ink">Suivant</button></div></div></article>

          <article className="rounded-md border border-cream/10 bg-forest p-6"><div className="flex items-center gap-2 text-gold"><Headphones size={18} /><p className="text-xs font-semibold uppercase tracking-[0.16em]">Carte sonore</p></div><h3 className="mt-3 font-display text-2xl">Écouter les territoires</h3><p className="mt-2 text-sm leading-relaxed text-cream/65">Chaque région possède une ambiance. Choisissez une escale et laissez-la vous accompagner.</p><div className="mt-6 space-y-2">{sounds.map((item, index) => <button type="button" key={item.region} onClick={() => setSoundIndex(index)} className={`flex w-full items-center gap-3 rounded border p-3 text-left transition ${index === soundIndex ? "border-gold bg-gold text-ink" : "border-cream/15 text-cream hover:border-gold"}`}><Map size={16} /><span className="flex-1 text-sm font-semibold">{item.region}</span>{index === soundIndex && <Volume2 size={15} />}</button>)}</div><div className="mt-6 border-t border-cream/15 pt-5"><p className="font-display text-xl">{sound.sound}</p><p className="mt-1 text-xs text-cream/60">{sound.desc}</p><audio key={sound.audio} className="mt-4 w-full" controls src={sound.audio}>Votre navigateur ne prend pas en charge l'audio.</audio></div></article>
        </div>

        <article className="mt-8 rounded-md border border-gold/30 bg-gold p-6 text-ink sm:flex sm:items-center sm:justify-between sm:gap-8"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink/60"><CalendarDays size={15} /> Défi du jour</div><h3 className="mt-2 font-display text-2xl">{dailyChallenge.question}</h3></div><div className="mt-5 grid gap-2 sm:mt-0 sm:min-w-80">{dailyChallenge.answers.map((option) => <button type="button" key={option} onClick={() => setAnswer(option)} className={`flex items-center justify-between rounded border px-3 py-2 text-left text-sm transition ${answer === option ? challengeState === "correct" ? "border-forest bg-forest text-cream" : "border-terracotta bg-terracotta text-cream" : "border-ink/20 bg-white/40 hover:border-ink"}`}>{option}{answer === option && <Check size={15} />}</button>)}<p className="mt-1 flex items-center gap-1 text-xs font-semibold">{challengeState === "correct" ? "Bonne réponse. Votre mémoire progresse !" : challengeState === "wrong" ? "Pas encore. Relisez la section des grandes figures." : <><Clock3 size={13} /> Une question nouvelle chaque jour</>}</p></div></article>
      </div>
    </section>
  );
}
