import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Headphones, Volume2 } from "lucide-react";

const chapters = [
  {
    number: "01",
    title: "La mémoire se raconte",
    label: "TRADITION ORALE",
    text: "Bienvenue dans Téranga. Ici, les histoires ne sont pas figées : elles circulent par les voix, les gestes et les générations. Commencez par rencontrer les griots, gardiens de la mémoire orale.",
    href: "/recits#contes",
    color: "bg-terracotta",
  },
  {
    number: "02",
    title: "Une île, mille silences",
    label: "ÎLE DE GORÉE",
    text: "Gorée est une île-mémoire au large de Dakar. Son architecture et la Maison des Esclaves portent un récit universel de mémoire et de résilience.",
    href: "/collections#expositions",
    color: "bg-ink",
  },
  {
    number: "03",
    title: "Les voix qui bâtissent",
    label: "GRANDES FIGURES",
    text: "De Lat Dior à Aline Sitoé Diatta, les grandes figures du Sénégal ont résisté, imaginé et construit. Découvrez leurs parcours dans notre collection historique.",
    href: "/recits#figures-historiques",
    color: "bg-forest",
  },
  {
    number: "04",
    title: "Votre trace commence ici",
    label: "PASSEPORT PATRIMOINE",
    text: "Choisissez vos affinités, validez vos découvertes et construisez votre propre carnet de voyage dans la mémoire sénégalaise.",
    href: "/exploration#passeport",
    color: "bg-gold",
  },
];

export default function VisiteGuidee() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState([]);
  const chapter = chapters[current];

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const stopNarration = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const goTo = (index) => {
    stopNarration();
    setCurrent((index + chapters.length) % chapters.length);
  };

  const narrate = () => {
    if (!window.speechSynthesis) return;
    if (playing) {
      stopNarration();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${chapter.title}. ${chapter.text}`);
    utterance.lang = "fr-FR";
    utterance.rate = 0.92;
    utterance.pitch = 0.95;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      setPlaying(false);
      setCompleted((items) => items.includes(chapter.number) ? items : [...items, chapter.number]);
    };
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="visite-guidee" className="overflow-hidden bg-cream-dark py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta"><span className="h-px w-8 bg-terracotta" /> PARCOURS AUDIOGUIDÉ</div>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">Une histoire à écouter</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/65">Laissez le Griot vous guider à travers quatre fragments essentiels du patrimoine sénégalais.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink/55"><Headphones size={18} className="text-terracotta" /><span>{completed.length}/{chapters.length} chapitres écoutés</span><div className="h-1.5 min-w-32 flex-1 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${(completed.length / chapters.length) * 100}%` }} /></div></div>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-md bg-ink text-cream lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`${chapter.color} relative flex min-h-[360px] flex-col justify-between p-7 transition-colors duration-500 sm:p-10`}>
            <div className="flex items-start justify-between"><span className="font-display text-6xl text-white/35">{chapter.number}</span><span className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white">{chapter.label}</span></div>
            <div><p className="text-xs uppercase tracking-[0.18em] text-white/70">Chapitre de votre parcours</p><h3 className="mt-2 max-w-md font-display text-4xl leading-tight text-white sm:text-5xl">{chapter.title}</h3></div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10"><p className="max-w-xl text-lg leading-relaxed text-cream/85">{chapter.text}</p><div className="mt-8 flex flex-wrap items-center gap-3"><button type="button" onClick={narrate} className="inline-flex items-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-gold/90"><Volume2 size={17} />{playing ? "Pause la narration" : "Écouter ce chapitre"}</button><a href={chapter.href} onClick={stopNarration} className="inline-flex items-center gap-2 rounded border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition hover:border-cream">Explorer la section <ArrowRight size={16} /></a></div><div className="mt-10 flex items-center justify-between border-t border-cream/15 pt-5"><button type="button" onClick={() => goTo(current - 1)} className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-cream"><ArrowLeft size={16} /> Précédent</button><div className="flex gap-2" aria-label="Navigation des chapitres">{chapters.map((item, index) => <button type="button" key={item.number} onClick={() => goTo(index)} aria-label={`Chapitre ${item.number}`} aria-current={index === current ? "step" : undefined} className={`h-2 w-8 rounded-full transition ${index === current ? "bg-gold" : completed.includes(item.number) ? "bg-cream/60" : "bg-cream/20"}`} />)}</div><button type="button" onClick={() => goTo(current + 1)} className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-cream">Suivant <ArrowRight size={16} /></button></div></div>
        </div>
        {completed.length === chapters.length && <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-forest"><Check size={16} /> Parcours terminé. Votre badge d'explorateur vous attend dans le Passeport Patrimoine.</p>}
      </div>
    </section>
  );
}
