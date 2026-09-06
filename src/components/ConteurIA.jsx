import { useState } from "react";
import { Feather, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { historicalFigures } from "../data/content";
import LireAVoixHaute from "./LireAVoixHaute";
import PartagerBouton from "./PartagerBouton";
import { vibrate } from "../lib/mobile";

const LIEUX = ["Gorée", "Saint-Louis / Ndar", "Casamance", "Delta du Saloum", "Touba", "Le fleuve Sénégal"];

const TONES = [
  { id: "enfant", label: "Conte pour enfants" },
  { id: "griot", label: "Poème de griot" },
  { id: "historique", label: "Récit historique" },
  { id: "legende", label: "Légende mystique" },
];

export default function ConteurIA() {
  const [subject, setSubject] = useState(historicalFigures[0].name);
  const [customSubject, setCustomSubject] = useState("");
  const [tone, setTone] = useState("enfant");
  const [story, setStory] = useState("");
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveSubject = customSubject.trim() || subject;

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: effectiveSubject, tone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Le récit n'a pas pu être généré.");
      setStory(data.story);
      setMode(data.mode || "ia");
      vibrate(15);
    } catch (err) {
      setError(err.message);
      vibrate([10, 40, 10]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="conteur-ia" className="bg-charcoal py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" /> INTELLIGENCE ARTIFICIELLE
          </div>
          <h2 className="font-display text-4xl sm:text-5xl">Le Conteur — récits générés pour vous</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">
            Choisissez une figure, un lieu ou un thème libre, un ton, et laissez le Conteur composer
            pour vous un récit original, inspiré du patrimoine sénégalais.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-md border border-cream/10 bg-cream/5 p-6">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-gold" htmlFor="conteur-subject">
              Sujet du récit
            </label>
            <select
              id="conteur-subject"
              value={subject}
              onChange={(event) => { setSubject(event.target.value); setCustomSubject(""); }}
              className="mt-2 w-full rounded border border-cream/20 bg-charcoal px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
            >
              <optgroup label="Figures historiques">
                {historicalFigures.map((figure) => (
                  <option key={figure.name} value={figure.name}>{figure.name}</option>
                ))}
              </optgroup>
              <optgroup label="Lieux emblématiques">
                {LIEUX.map((lieu) => (
                  <option key={lieu} value={lieu}>{lieu}</option>
                ))}
              </optgroup>
            </select>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gold" htmlFor="conteur-custom">
              Ou un sujet libre
            </label>
            <input
              id="conteur-custom"
              value={customSubject}
              onChange={(event) => setCustomSubject(event.target.value)}
              placeholder="ex. le baobab de mon village, la lutte sénégalaise..."
              className="mt-2 w-full rounded border border-cream/20 bg-charcoal px-3 py-2.5 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-gold"
            />

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold">Ton du récit</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {TONES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTone(option.id)}
                  className={`rounded border px-3 py-2 text-left text-xs font-semibold transition ${
                    tone === option.id ? "border-gold bg-gold text-ink" : "border-cream/20 text-cream/75 hover:border-gold"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-terracotta px-5 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta-dark disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Le Conteur compose..." : story ? "Générer un autre récit" : "Générer le récit"}
            </button>
          </div>

          <div className="rounded-md border border-cream/10 bg-cream/5 p-6 sm:p-8">
            {!story && !loading && !error && (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-cream/45">
                <Feather size={28} className="mb-3" />
                <p className="text-sm">Votre récit apparaîtra ici, prêt à être lu ou écouté.</p>
              </div>
            )}
            {loading && (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-cream/50">
                <Loader2 size={26} className="mb-3 animate-spin text-gold" />
                <p className="text-sm">Le Conteur consulte la mémoire de {effectiveSubject}...</p>
              </div>
            )}
            {error && <p className="rounded border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-terracotta">{error}</p>}
            {story && !loading && (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
                  {effectiveSubject} · {TONES.find((t) => t.id === tone)?.label}
                  {mode === "local" && " · mode hors-ligne"}
                </p>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-cream/85">{story}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <LireAVoixHaute text={story} label="Écouter le récit" className="border-gold text-gold" />
                  <PartagerBouton
                    title={`Téranga — ${effectiveSubject}`}
                    text={story}
                    label="Partager"
                    className="border-cream/40 text-cream/80"
                  />
                  <button
                    type="button"
                    onClick={generate}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cream/25 px-3.5 py-1.5 text-xs font-semibold text-cream/75 hover:border-cream/50"
                  >
                    <RefreshCcw size={13} /> Régénérer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
