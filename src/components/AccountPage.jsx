import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TerangaMark from "./TerangaMark";

export default function AccountPage({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === "admin" ? "/admin" : "/espace", { replace: true });
  }, [navigate, user]);

  if (user) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const account = mode === "register"
        ? await register({ name: form.get("name"), email: form.get("email"), password: form.get("password") })
        : await login({ email: form.get("email"), password: form.get("password") });
      navigate(account.role === "admin" ? "/admin" : "/espace", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-terracotta"><ArrowLeft size={16} /> Retour au site</Link>
        <div className="mt-8 grid overflow-hidden rounded-xl bg-white shadow-xl md:grid-cols-[1fr_0.9fr]">
          <div className="bg-ink p-8 text-cream sm:p-12">
            <TerangaMark className="h-14 w-auto" />
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Votre espace Téranga</p>
            <h1 className="mt-3 max-w-md font-display text-4xl leading-tight sm:text-5xl">La mémoire se partage et se protège ensemble.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65">Retrouvez vos contributions et participez à la transmission du patrimoine sénégalais.</p>
          </div>
          <div className="p-7 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{mode === "login" ? "Bienvenue" : "Créer un compte client"}</p>
            <h2 className="mt-2 font-display text-3xl">{mode === "login" ? "Connexion" : "Rejoindre Téranga"}</h2>
            <p className="mt-2 text-sm text-ink/55">{mode === "login" ? "Connectez-vous pour accéder à votre espace." : "Un espace personnel pour suivre vos archives partagées."}</p>
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {mode === "register" && <label className="block text-sm font-semibold">Nom complet<div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3"><UserRound size={17} className="text-ink/40" /><input name="name" autoComplete="name" minLength="2" maxLength="100" required className="min-h-12 w-full bg-transparent text-sm outline-none" placeholder="Votre nom" /></div></label>}
              <label className="block text-sm font-semibold">Adresse e-mail<div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3"><Mail size={17} className="text-ink/40" /><input name="email" type="email" autoComplete="email" required className="min-h-12 w-full bg-transparent text-sm outline-none" placeholder="vous@exemple.sn" /></div></label>
              <label className="block text-sm font-semibold">Mot de passe<div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 px-3"><KeyRound size={17} className="text-ink/40" /><input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength="10" required className="min-h-12 w-full bg-transparent text-sm outline-none" placeholder={mode === "login" ? "Votre mot de passe" : "10 caractères minimum"} /></div></label>
              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
              <button disabled={submitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-4 text-sm font-semibold text-cream transition hover:bg-terracotta-dark disabled:opacity-60">{submitting ? "Veuillez patienter…" : mode === "login" ? "Se connecter" : "Créer mon compte"}<ArrowRight size={16} /></button>
            </form>
            <p className="mt-6 text-center text-sm text-ink/60">{mode === "login" ? "Vous n'avez pas encore de compte ?" : "Vous avez déjà un compte ?"} <button type="button" onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }} className="font-semibold text-terracotta hover:underline">{mode === "login" ? "Créer un compte" : "Se connecter"}</button></p>
          </div>
        </div>
      </div>
    </main>
  );
}
