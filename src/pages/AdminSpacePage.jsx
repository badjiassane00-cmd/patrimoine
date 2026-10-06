import { useCallback, useEffect, useState } from "react";
import { Archive, Check, CheckCircle2, Clock3, RefreshCw, X } from "lucide-react";
import SpaceLayout from "../components/SpaceLayout";
import { apiRequest } from "../lib/api";

export default function AdminSpacePage() {
  const [contributions, setContributions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    try {
      const result = await apiRequest("/api/admin/contributions");
      setError("");
      setContributions(result.contributions);
    } catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/api/admin/contributions")
      .then((result) => {
        if (!active) return;
        setError("");
        setContributions(result.contributions);
      })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function review(id, status) {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/api/admin/contributions/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setNotice(status === "approved" ? "La proposition a été validée." : "La proposition a été refusée.");
      await refresh();
    } catch (reviewError) { setError(reviewError.message); }
    finally { setBusyId(null); }
  }

  const pendingCount = contributions.filter((item) => item.status === "pending").length;
  const approvedCount = contributions.filter((item) => item.status === "approved").length;
  const filtered = contributions.filter((item) => filter === "all" || item.status === filter);

  return (
    <SpaceLayout kind="admin">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Gestion des archives</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">Espace administration</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">Examinez les propositions de la communauté et accompagnez leur mise en valeur.</p></div><button type="button" onClick={refresh} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-ink/15 bg-white px-3 text-xs font-semibold hover:border-terracotta hover:text-terracotta"><RefreshCw size={15} />Actualiser</button></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric icon={Clock3} label="À examiner" value={pendingCount} color="text-amber-700 bg-amber-50" /><Metric icon={CheckCircle2} label="Validées" value={approvedCount} color="text-emerald-700 bg-emerald-50" /><Metric icon={Archive} label="Total propositions" value={contributions.length} color="text-terracotta bg-terracotta/10" /></div>
      <section className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-ink/45">File de modération</p><h2 className="font-display text-2xl">Contributions reçues</h2></div><div className="flex flex-wrap gap-2" aria-label="Filtrer les contributions">{[["pending", "À examiner"], ["approved", "Validées"], ["rejected", "Refusées"], ["all", "Toutes"]].map(([value, label]) => <button type="button" key={value} onClick={() => setFilter(value)} className={`rounded-full px-3 py-2 text-xs font-semibold ${filter === value ? "bg-ink text-white" : "bg-cream text-ink/65 hover:bg-cream-dark"}`}>{label}</button>)}</div></div>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}{notice && <p role="status" className="mt-5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p>}
        {loading ? <p className="py-14 text-center text-sm text-ink/50">Chargement des archives…</p> : filtered.length === 0 ? <div className="py-16 text-center"><Archive size={30} className="mx-auto text-ink/25" /><p className="mt-3 text-sm font-semibold">Aucune contribution dans cette vue</p><p className="mt-1 text-xs text-ink/50">Les nouvelles propositions apparaîtront ici.</p></div> : <div className="mt-5 space-y-4">{filtered.map((item) => <article key={item.id} className="rounded-xl border border-ink/10 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">{item.status === "pending" ? "Nouvelle proposition" : item.status === "approved" ? "Validée" : "Refusée"}</span><h3 className="mt-1 font-display text-xl">{item.title}</h3><p className="mt-1 text-xs text-ink/50">Par {item.user_name} · {item.user_email} · {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p></div><span className="rounded-lg bg-cream px-3 py-1.5 text-xs font-semibold text-ink/65">#{item.id}</span></div><p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/75">{item.description}</p>{item.status === "pending" && <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-ink/10 pt-4"><button type="button" disabled={busyId === item.id} onClick={() => review(item.id, "rejected")} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-ink/15 px-3 text-xs font-semibold text-ink/70 hover:border-red-300 hover:text-red-700 disabled:opacity-50"><X size={15} />Refuser</button><button type="button" disabled={busyId === item.id} onClick={() => review(item.id, "approved")} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-forest px-3 text-xs font-semibold text-white hover:bg-forest-dark disabled:opacity-50"><Check size={15} />{busyId === item.id ? "Enregistrement…" : "Valider"}</button></div>}</article>)}</div>}
      </section>
    </SpaceLayout>
  );
}

function Metric({ icon: Icon, label, value, color }) {
  return <article className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon size={20} /></span><span><span className="block text-xs font-semibold text-ink/50">{label}</span><span className="font-display text-3xl">{value}</span></span></article>;
}
