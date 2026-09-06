import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Database, SkipForward } from "lucide-react";
import Manifeste from "./Manifeste";

export default function Hero() {
  const [introVisible, setIntroVisible] = useState(() => {
    try {
      return sessionStorage.getItem("teranga-intro-seen") !== "true";
    } catch {
      return true;
    }
  });
  const [progress, setProgress] = useState(0);

  const dismissIntro = () => {
    setIntroVisible(false);
    try {
      sessionStorage.setItem("teranga-intro-seen", "true");
    } catch {
      // Storage may be unavailable in private browsing.
    }
  };

  useEffect(() => {
    if (!introVisible) return undefined;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(timer);
          window.setTimeout(dismissIntro, 350);
          return 100;
        }
        return value + 4;
      });
    }, 45);
    return () => window.clearInterval(timer);
  }, [introVisible]);

  return (
    <section id="accueil" className="relative isolate overflow-hidden bg-ink">
      <img src="https://commons.wikimedia.org/wiki/Special:FilePath/La_Maison_des_Esclaves.jpg?width=2200" alt="Maison des Esclaves sur l'île de Gorée" className="absolute inset-0 h-full w-full object-cover opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="site-grain absolute inset-0 opacity-30" />

      {introVisible && <div className="absolute inset-0 z-20 flex items-end bg-ink/95 p-6 sm:p-12" role="dialog" aria-label="Initialisation des archives">
        <div className="w-full max-w-2xl font-mono text-xs text-gold sm:text-sm">
          <div className="mb-8 flex items-center gap-3 text-cream"><Database size={18} /><span>TERANGA_ARCHIVE_SYSTEM</span><span className="animate-pulse">●</span></div>
          <p className="text-cream/55">// INITIALISATION DU MUSÉE NUMÉRIQUE</p>
          <p className="mt-2 text-cream/80">CHARGEMENT DES RÉCITS, DES VOIX ET DES TERRITOIRES...</p>
          <div className="mt-6 h-1 w-full bg-cream/15"><div className="h-full bg-gold transition-all duration-75" style={{ width: `${progress}%` }} /></div>
          <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-cream/45"><span>{progress < 100 ? "Connexion aux archives" : "Archives prêtes"}</span><span>{progress}%</span></div>
          <button type="button" onClick={dismissIntro} className="mt-8 inline-flex items-center gap-2 border border-cream/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream transition hover:border-gold hover:text-gold"><SkipForward size={14} /> Accéder directement</button>
        </div>
      </div>}

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-between px-6 py-14 sm:min-h-[760px] sm:py-20">
        <div className="reveal-up max-w-3xl">
          <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-gold">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            ARCHIVES VIVANTES · SÉNÉGAL
          </div>
          <h1 className="max-w-2xl font-display text-5xl leading-[0.98] text-cream sm:text-7xl lg:text-[6.5rem]">
            La mémoire devient expérience.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/78 sm:text-lg">
            Un voyage immersif à travers l'histoire, l'art, les contes
            traditionnels et les richesses du patrimoine culturel matériel et
            immatériel national.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/collections"
              className="inline-flex items-center gap-2 rounded bg-terracotta px-6 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-terracotta-dark"
            >
              EXPLORER LES ARCHIVES
              <ArrowRight size={16} />
            </a>
            <a href="#visite-guidee" className="rounded border border-cream/40 px-6 py-3.5 text-sm font-semibold tracking-wide text-cream transition-colors hover:border-cream">
              ÉCOUTER LE PARCOURS
            </a>
            <Manifeste />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 text-cream">
          <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2.5 text-xs text-cream/75">
            <ChevronDown size={16} className="animate-bounce" aria-hidden="true" />
            Faites défiler pour entrer dans le récit
          </div>
          <dl className="glass-panel flex gap-8 rounded-2xl px-5 py-4 sm:gap-10">
            <div>
              <dt className="sr-only">Archives numériques</dt>
              <dd className="font-display text-2xl text-gold">15k+</dd>
              <dt className="text-[11px] tracking-wide text-cream/60">
                ARCHIVES NUMÉRIQUES
              </dt>
            </div>
            <div>
              <dt className="sr-only">Sites classés UNESCO</dt>
              <dd className="font-display text-2xl text-gold">07</dd>
              <dt className="text-[11px] tracking-wide text-cream/60">
                SITES CLASSÉS UNESCO
              </dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
