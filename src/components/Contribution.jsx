import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PlaceholderImage from "./PlaceholderImage";

export default function Contribution() {
  const [modal, setModal] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const contributionPath = user?.role === "admin" ? "/admin" : user ? "/espace" : "/inscription";

  return (
    <>
      <section id="contribution" className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid overflow-hidden rounded-lg bg-ink sm:grid-cols-2">
          <div className="p-8 text-cream sm:p-10">
            <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold">
              MÉDIATION PARTICIPATIVE
            </span>
            <h2 className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
              Participez à la construction de la mémoire nationale
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Vous détenez des histoires de famille, de vieux manuscrits,
              des enregistrements sonores traditionnels ou des photographies
              historiques ? Aidez-nous à enrichir nos collections numériques
              en partageant votre trésor familial.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate(contributionPath)} className="inline-flex items-center gap-2 rounded bg-gold px-5 py-3 text-sm font-semibold text-ink hover:bg-gold/90">
                DÉPOSER UNE CONTRIBUTION
                <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => setModal("guide")} className="rounded border border-cream/30 px-5 py-3 text-sm font-semibold text-cream hover:border-cream">
                GUIDE DES ARCHIVES
              </button>
            </div>
          </div>
          <PlaceholderImage
            label="Photographies et manuscrits de famille"
            palette="gold"
            className="min-h-[220px] w-full"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-lg bg-cream-dark p-8 text-center sm:p-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-terracotta">
            LETTRE D'INFORMATION
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">
            Restez connectés à notre héritage commun
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink/60">
            Abonnez-vous pour recevoir chaque mois de nouveaux contes
            traditionnels, des sélections d'archives inédites et les
            actualités de nos expositions.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Adresse e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Votre adresse email…"
              className="flex-1 rounded border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40"
              required
            />
            <button
              type="submit"
              className="rounded bg-terracotta px-6 py-3 text-sm font-semibold text-cream hover:bg-terracotta-dark"
            >
              S'ABONNER
            </button>
          </form>
          {subscribed && <p className="mt-4 text-sm font-semibold text-forest">Inscription confirmée. Merci de suivre notre patrimoine.</p>}
        </div>
      </section>
      {modal === "guide" && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label="Guide des archives"><div className="relative w-full max-w-lg rounded bg-cream p-7 text-ink"><button type="button" onClick={() => setModal(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button><h3 className="font-display text-3xl">Guide des archives</h3><p className="mt-4 text-sm leading-relaxed text-ink/70">Préparez une image nette, indiquez sa date et son lieu, puis précisez les droits de diffusion dont vous disposez.</p><button type="button" onClick={() => setModal(null)} className="mt-6 rounded bg-forest px-4 py-2.5 text-sm font-semibold text-cream">J'ai compris</button></div></div>}
    </>
  );
}
