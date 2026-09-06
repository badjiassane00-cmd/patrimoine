import { useEffect, useState } from "react";
import { ArrowDownRight, CheckCircle2, ChevronDown, Headphones, Home, MapPin, Maximize2, Pause, Play, Search, ShieldCheck, Users2, Volume2, X } from "lucide-react";
import { destinations } from "../data/content";

function FauxSelect({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-white/50">
        {label}
      </span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded border border-white/15 bg-white px-3 py-2.5 pr-9 text-sm text-ink">
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-ink/40" />
      </span>
    </label>
  );
}

export default function Immersions() {
  const [activeDestination, setActiveDestination] = useState(destinations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [exploring, setExploring] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingSent, setBookingSent] = useState(false);
  const [search, setSearch] = useState({ destination: destinations[0].title, date: "12 Mars 2027", travelers: "2 voyageurs", guide: "Historique & culturel" });
  const [searched, setSearched] = useState(false);

  const openBooking = (destination = activeDestination) => {
    setBooking(destination);
    setBookingSent(false);
    setSearch((current) => ({ ...current, destination: destination.title }));
  };

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => {
      setActiveDestination((current) => {
        const currentIndex = destinations.findIndex((destination) => destination.title === current.title);
        return destinations[(currentIndex + 1) % destinations.length];
      });
      setIsPlaying(false);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="immersions" className="overflow-hidden bg-charcoal px-6 py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
          <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
          IMMERSIONS TOURISTIQUES
          <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
        </div>
        <h2 className="font-display text-3xl text-cream sm:text-5xl">
          Entrez dans le paysage
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cream/60">
          Une collection de récits visuels à parcourir comme un carnet de voyage vivant.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
        <article className="group relative min-h-[560px] overflow-hidden rounded-sm bg-ink" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <img key={activeDestination.image} src={activeDestination.image} alt={activeDestination.imageAlt} className="absolute inset-0 h-full w-full animate-[media-fade_700ms_ease-out] object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
          <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-gold sm:left-8 sm:top-8">
            <span className="h-px w-7 bg-gold" /> IMMERSION {String(destinations.findIndex((destination) => destination.title === activeDestination.title) + 1).padStart(2, "0")} / 06
          </div>
          <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{activeDestination.chapter}</p>
            <h3 className="mt-2 max-w-xl font-display text-4xl leading-none text-white sm:text-6xl">{activeDestination.title}</h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">{activeDestination.desc}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setIsPlaying((playing) => !playing)} className="inline-flex items-center gap-2 rounded bg-terracotta px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-terracotta-dark" aria-label={isPlaying ? "Mettre l'ambiance en pause" : "Lancer l'ambiance sonore"}>
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                {isPlaying ? "Pause" : "Lancer l'ambiance"}
              </button>
              <button className="inline-flex items-center gap-2 rounded border border-white/35 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white">
                <Maximize2 size={15} /> Vue panoramique
              </button>
            </div>
          </div>
          <div className="absolute right-5 top-5 hidden items-center gap-2 text-xs text-white/70 sm:flex sm:right-8 sm:top-8"><Volume2 size={15} /> Son d'ambiance</div>
        </article>

        <div className="flex flex-col border-y border-white/15 lg:border-y-0">
          <div className="flex items-center justify-between border-b border-white/15 py-4 text-xs uppercase tracking-[0.16em] text-white/50">
            <span>Choisir une escale</span><Headphones size={16} />
          </div>
          {destinations.map((dest, index) => (
            <button key={dest.title} onClick={() => { setActiveDestination(dest); setIsPlaying(false); }} className={`group flex items-center gap-4 border-b border-white/15 py-4 text-left transition ${activeDestination.title === dest.title ? "text-gold" : "text-white/65 hover:text-white"}`}>
              <span className="font-display text-xl">0{index + 1}</span>
              <span className="flex-1 text-sm font-semibold">{dest.title}</span>
              <ArrowDownRight size={17} className="opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
          <div className="mt-auto pt-8 text-sm leading-relaxed text-white/45">Chaque escale ouvre un fragment de territoire, une voix et une lumière.</div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest) => (
          <article key={dest.title} className="rounded-md border border-white/10 bg-white/[0.06]">
            <div className="relative">
              <img src={dest.image} alt={dest.imageAlt} className="aspect-[4/3] w-full rounded-t-md object-cover" loading="lazy" />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-forest">
                ★ {dest.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg text-cream">{dest.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {dest.desc}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/45">
                <span className="flex items-center gap-1"><MapPin size={13} /> {dest.location}</span>
                <span className="flex items-center gap-1"><Home size={13} /> {dest.hotels} Hôtels</span>
                <span className="flex items-center gap-1"><Users2 size={13} /> {dest.guides} Guides</span>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setExploring(dest)} className="flex-1 rounded bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-forest-dark">
                  Explorer
                </button>
                <button onClick={() => openBooking(dest)} className="flex-1 rounded border border-terracotta px-4 py-2.5 text-sm font-semibold text-terracotta hover:bg-terracotta/10">
                  Réserver un guide
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-white/10 bg-white/[0.06] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-cream">Réservez votre expérience</h3>
            <p className="mt-1 text-sm text-white/55">
              Planifiez dès aujourd'hui votre immersion sénégalaise sur-mesure avec un guide officiel certifié.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold-dark">
            <ShieldCheck size={14} /> Guides Agréés par l'État
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <FauxSelect label="DESTINATION" value={search.destination} options={destinations.map((destination) => destination.title)} onChange={(destination) => setSearch({ ...search, destination })} />
          <FauxSelect label="DATES D'IMMERSION" value={search.date} options={["12 Mars 2027", "20 Avril 2027", "08 Juin 2027"]} onChange={(date) => setSearch({ ...search, date })} />
          <FauxSelect label="VOYAGEURS" value={search.travelers} options={["1 voyageur", "2 voyageurs", "3 voyageurs", "4 voyageurs"]} onChange={(travelers) => setSearch({ ...search, travelers })} />
          <FauxSelect label="TYPE DE GUIDE" value={search.guide} options={["Historique & culturel", "Nature & biodiversité", "Artisanat & traditions"]} onChange={(guide) => setSearch({ ...search, guide })} />
          <button onClick={() => setSearched(true)} className="flex items-center justify-center gap-2 self-end rounded bg-forest px-6 py-2.5 text-sm font-semibold text-cream hover:bg-forest-dark">
            <Search size={15} />
            Rechercher les guides
          </button>
        </div>
        {searched && <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded border border-gold/30 bg-gold/10 p-4 text-sm text-cream"><span><strong>3 guides disponibles</strong> pour {search.destination}, {search.travelers}.</span><button onClick={() => openBooking(destinations.find((destination) => destination.title === search.destination))} className="rounded bg-gold px-4 py-2 font-semibold text-ink">Voir les disponibilités</button></div>}
      </div>

      {exploring && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label={`Explorer ${exploring.title}`}>
        <div className="relative grid max-h-[90vh] max-w-3xl overflow-auto rounded bg-cream text-ink sm:grid-cols-2">
          <button onClick={() => setExploring(null)} className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white" aria-label="Fermer"><X size={18} /></button>
          <img src={exploring.image} alt={exploring.imageAlt} className="h-64 w-full object-cover sm:h-full" />
          <div className="p-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{exploring.tag}</p><h3 className="mt-3 font-display text-3xl">{exploring.title}</h3><p className="mt-4 text-sm leading-relaxed text-ink/70">{exploring.desc}</p><div className="mt-6 grid grid-cols-3 gap-3 border-y border-ink/10 py-4 text-xs text-ink/60"><span><MapPin size={14} className="mb-1" />{exploring.location}</span><span><Home size={14} className="mb-1" />{exploring.hotels} hôtels</span><span><Users2 size={14} className="mb-1" />{exploring.guides} guides</span></div><button onClick={() => { setExploring(null); openBooking(exploring); }} className="mt-6 w-full rounded bg-forest px-4 py-3 text-sm font-semibold text-cream">Réserver cette expérience</button></div>
        </div>
      </div>}

      {booking && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label="Réserver un guide">
        <div className="relative w-full max-w-lg rounded bg-cream p-7 text-ink">
          <button onClick={() => setBooking(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button>
          {!bookingSent ? <><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">Demande de réservation</p><h3 className="mt-2 font-display text-3xl">{booking.title}</h3><form onSubmit={(event) => { event.preventDefault(); setBookingSent(true); }} className="mt-6 space-y-4"><label className="block text-sm font-semibold">Votre nom<input required name="name" className="mt-1 w-full rounded border border-ink/15 bg-white px-3 py-2.5 font-normal" placeholder="Aminata Ndiaye" /></label><label className="block text-sm font-semibold">Votre e-mail<input required type="email" name="email" className="mt-1 w-full rounded border border-ink/15 bg-white px-3 py-2.5 font-normal" placeholder="vous@exemple.com" /></label><label className="block text-sm font-semibold">Message<textarea name="message" rows="3" className="mt-1 w-full rounded border border-ink/15 bg-white px-3 py-2.5 font-normal" placeholder="Précisez vos envies d'immersion..." /></label><button type="submit" className="w-full rounded bg-forest px-4 py-3 text-sm font-semibold text-cream">Envoyer la demande</button></form></> : <div className="py-10 text-center"><CheckCircle2 size={48} className="mx-auto text-forest" /><h3 className="mt-4 font-display text-3xl">Demande envoyée</h3><p className="mt-3 text-sm text-ink/60">Un guide vous recontactera rapidement à l'adresse indiquée.</p><button onClick={() => setBooking(null)} className="mt-6 rounded bg-terracotta px-5 py-3 text-sm font-semibold text-cream">Fermer</button></div>}
        </div>
      </div>}
      </div>
    </section>
  );
}
