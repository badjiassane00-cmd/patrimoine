import { useCallback, useEffect, useState } from "react";
import { Archive, ArrowRight, CheckCircle2, Clock3, FilePlus2, Send, XCircle } from "lucide-react";
import SpaceLayout from "../components/SpaceLayout";
import { apiRequest } from "../lib/api";

const STATUS = {
  pending: { label: "En attente", icon: Clock3, style: "bg-amber-50 text-amber-800" },
  approved: { label: "Validée", icon: CheckCircle2, style: "bg-emerald-50 text-emerald-800" },
  rejected: { label: "Refusée", icon: XCircle, style: "bg-red-50 text-red-800" },
};

export default function ClientSpacePage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const result = await apiRequest("/api/contributions");
      setError("");
      setContributions(result.contributions);
    } catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/api/contributions")
      .then((result) => {
        if (!active) return;
        setError("");
        setContributions(result.contributions);
      })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function submitContribution(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSending(true);
    setError("");
    setNotice("");
    const form = new FormData(formElement);
    try {
      await apiRequest("/api/contributions", { method: "POST", body: JSON.stringify({ title: form.get("title"), description: form.get("description") }) });
      formElement.reset();
      setNotice("Votre proposition a été envoyée à l’équipe de médiation.");
      await refresh();
    } catch (submitError) { setError(submitError.message); }
    finally { setSending(false); }
  }

  return (
    <SpaceLayout kind="client">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Votre espace personnel</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">Mes archives partagées</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">Suivez vos propositions et contribuez à faire vivre la mémoire du Sénégal.</p></div><div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm shadow-sm"><Archive size={18} className="text-terracotta" /><span className="font-semibold">{contributions.length}</span><span className="text-ink/55">contribution{contributions.length > 1 ? "s" : ""}</span></div></div>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-xl bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta"><FilePlus2 size={19} /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Transmettre une archive</p><h2 className="font-display text-2xl">Proposer un récit</h2></div></div><p className="mt-4 text-sm leading-relaxed text-ink/60">Décrivez une histoire, une photographie ou un savoir-faire que vous souhaitez partager avec la communauté.</p><form onSubmit={submitContribution} className="mt-5 space-y-4"><label className="block text-xs font-semibold">Titre de votre proposition<input name="title" required minLength="3" maxLength="160" placeholder="Ex. Un récit transmis par ma grand-mère" className="mt-1.5 min-h-11 w-full rounded-lg border border-ink/15 bg-cream/40 px-3 text-sm outline-none focus:border-terracotta" /></label><label className="block text-xs font-semibold">Votre description<textarea name="description" required minLength="10" maxLength="5000" rows="5" placeholder="D’où vient cette histoire ? Qui vous l’a transmise ?" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-cream/40 p-3 text-sm outline-none focus:border-terracotta" /></label>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}{notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}<button disabled={sending} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-4 text-sm font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60">{sending ? "Envoi…" : "Envoyer à l’équipe"}<Send size={15} /></button></form></section>
        <section className="rounded-xl bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Historique</p><h2 className="font-display text-2xl">Suivi des propositions</h2></div><button type="button" onClick={refresh} className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta hover:underline">Actualiser<ArrowRight size={14} /></button></div>{loading ? <p className="py-12 text-center text-sm text-ink/50">Chargement de vos contributions…</p> : contributions.length === 0 ? <div className="py-14 text-center"><Archive size={28} className="mx-auto text-ink/25" /><p className="mt-3 text-sm font-semibold">Aucune proposition pour le moment</p><p className="mt-1 text-xs text-ink/50">Vos archives apparaîtront ici après leur envoi.</p></div> : <div className="mt-5 divide-y divide-ink/10">{contributions.map((item) => { const state = STATUS[item.status]; const Icon = state.icon; return <article key={item.id} className="py-5 first:pt-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><time className="mt-1 block text-xs text-ink/45" dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time></div><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${state.style}`}><Icon size={13} />{state.label}</span></div><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/60">{item.description}</p></article>; })}</div>}</section>
      </div>
    </SpaceLayout>
  );
}
