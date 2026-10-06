import { useState } from "react";
import { Archive, ArrowUpRight, CircleUserRound, DoorOpen, LayoutDashboard, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TerangaMark from "./TerangaMark";

export default function SpaceLayout({ children, kind }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = kind === "admin";

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  const links = admin
    ? [{ href: "/admin", label: "Modération", icon: LayoutDashboard }]
    : [{ href: "/espace", label: "Mes contributions", icon: Archive }];

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to={admin ? "/admin" : "/espace"} className="flex items-center gap-3"><TerangaMark size={42} /><span><span className="block font-display text-lg leading-tight">Téranga</span><span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink/45">{admin ? "Administration" : "Espace contributeur"}</span></span></Link>
          <nav className={`${menuOpen ? "absolute inset-x-0 top-full flex flex-col border-b border-ink/10 bg-white p-4 shadow-lg" : "hidden"} gap-2 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`} aria-label="Navigation de l’espace">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} to={href} onClick={() => setMenuOpen(false)} className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink/70 hover:bg-cream hover:text-terracotta"><Icon size={16} />{label}</Link>)}
            <Link to="/" className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink/60 hover:bg-cream"><ArrowUpRight size={16} />Voir le site</Link>
          </nav>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 text-right sm:flex"><CircleUserRound size={20} className="text-terracotta" /><span><span className="block text-xs font-semibold">{user?.name}</span><span className="text-[10px] uppercase tracking-wider text-ink/45">{admin ? "Administrateur" : "Contributeur"}</span></span></div><button type="button" onClick={handleLogout} className="hidden min-h-10 items-center gap-2 rounded-lg border border-ink/10 px-3 text-xs font-semibold hover:border-terracotta hover:text-terracotta sm:flex"><DoorOpen size={15} />Déconnexion</button><button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">{children}</main>
      <footer className="border-t border-ink/10 px-5 py-5 text-center text-xs text-ink/45">Téranga · La mémoire sénégalaise, vivante et partagée</footer>
    </div>
  );
}
