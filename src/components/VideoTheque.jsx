import { useState } from "react";
import { ArrowRight, Clock, Sparkles, Play } from "lucide-react";
import { videos } from "../data/content";

export default function VideoTheque() {
  const [activeVideo, setActiveVideo] = useState(videos[0]);

  return (
    <section id="videotheque" className="bg-ink py-20 text-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              PLONGEZ DANS L'HISTOIRE
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">
              L'immersion par le geste et le verbe
            </h2>
          </div>
          <a
            href="#videotheque"
            className="inline-flex items-center gap-2 rounded border border-cream/30 px-5 py-3 text-sm font-semibold tracking-wide transition-colors hover:border-cream"
          >
            ACCÉDER À LA VIDÉOTHÈQUE
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="group relative overflow-hidden rounded-md bg-black">
            <video key={activeVideo.src} className="aspect-video w-full object-cover" controls playsInline preload="metadata" poster={activeVideo.poster} autoPlay={activeVideo !== videos[0]}>
              <source src={activeVideo.src} type={activeVideo.mime || "video/mp4"} />
              Votre navigateur ne prend pas en charge la vidéo.
            </video>
            <div className="pointer-events-none absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-cream transition-transform group-hover:scale-105">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
          <div>
            <p className="mb-3 inline-block rounded-full bg-cream/10 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-gold">
              DOCUMENTAIRE VEDETTE
            </p>
            <h3 className="font-display text-2xl sm:text-3xl">{activeVideo.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              {activeVideo.desc || "Une capsule audiovisuelle pour découvrir un geste, une voix et un territoire du Sénégal."}
            </p>
            {activeVideo.mediaNote && <p className="mt-3 text-xs italic text-gold/80">{activeVideo.mediaNote}</p>}
            <div className="mt-5 flex items-center gap-6 text-sm text-cream/60">
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> Durée : {activeVideo.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={15} /> Qualité : {activeVideo.quality || "HD"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {videos.slice(1).map((video) => (
            <button
              key={video.title}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="flex items-center gap-4 rounded-md bg-cream/5 p-3 transition-colors hover:bg-cream/10"
            >
              <img src={video.poster} alt="" className="h-16 w-24 shrink-0 rounded object-cover" loading="lazy" />
              <div>
                <p className="text-sm font-medium">{video.title}</p>
                <p className="text-xs text-cream/50">{video.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
