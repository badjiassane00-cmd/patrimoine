import { useState } from "react";
import { ArrowRight, Volume2, Play, Pause } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import LireAVoixHaute from "./LireAVoixHaute";
import { contes } from "../data/content";

export default function Contes() {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const selectedConte = selected || contes.featured;

  const selectConte = (conte) => {
    setSelected(conte);
    setPlaying(true);
  };
  const togglePlay = () => setPlaying((current) => !current);

  return (
    <section id="contes" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta">
            <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
            CONTES DU TERROIR
          </div>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            La sagesse de la tradition orale
          </h2>
        </div>
        <a
          href="#contes"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-terracotta"
        >
          Découvrir tous les contes
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <article className="grid overflow-hidden rounded-md border border-ink/10 bg-white/40 sm:grid-cols-2">
          <PlaceholderImage
            label={contes.featured.title}
            src={selectedConte.image}
            alt={selectedConte.title}
            palette="gold"
            className="min-h-[220px] w-full"
          />
          <div className="flex flex-col justify-center p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded bg-terracotta/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-terracotta">
                {selectedConte.tag || "CONTE AUDIO"}
              </span>
              <span className="flex items-center gap-1 text-xs text-ink/50">
                <Volume2 size={13} /> Version Audio
              </span>
            </div>
            <h3 className="font-display text-xl text-ink">
              {selectedConte.title}
            </h3>
            <p className="mt-3 text-sm italic leading-relaxed text-ink/70">
              « {selectedConte.quote || selectedConte.desc} »
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={togglePlay} className="inline-flex w-fit items-center gap-2 rounded bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-ink-light">
                {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                {playing ? "Mettre en pause" : selectedConte.action || "Écouter le conte"}
              </button>
              <LireAVoixHaute text={selectedConte.quote || selectedConte.desc} label="Voix du Griot" className="border-ink text-ink" />
            </div>
            {playing && <audio className="mt-4 w-full" controls autoPlay src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">Votre navigateur ne prend pas en charge l'audio.</audio>}
          </div>
        </article>

        <div className="flex flex-col gap-5">
          {contes.list.map((conte) => (
            <button
              key={conte.title}
              type="button"
              onClick={() => selectConte(conte)}
              className="flex gap-4 rounded-md border border-ink/10 bg-white/40 p-5 text-left hover:border-terracotta"
            >
              <PlaceholderImage
                label={conte.title}
                src={conte.image}
                alt={conte.title}
                palette="forest"
                className="h-24 w-24 shrink-0 rounded"
              />
              <div>
                <div className="mb-1.5 flex items-center gap-3">
                  <span className="text-[11px] font-semibold tracking-wide text-terracotta">
                    {conte.meta}
                  </span>
                  <Volume2 size={13} className="text-ink/40" />
                </div>
                <h4 className="font-display text-lg text-ink">{conte.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  {conte.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
