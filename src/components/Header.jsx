import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { destinations, expositions, historicalFigures, snapshots, videos } from "../data/content";
import TerangaMark from "./TerangaMark";
import { vibrate } from "../lib/mobile";

const NAV_LINKS = [
  { label: "Découvrir", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Récits", href: "/recits" },
  { label: "Exploration", href: "/exploration" },
  { label: "Agenda", href: "/agenda" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [lastPathname, setLastPathname] = useState(location.pathname);
  const searchableItems = [
    ...expositions.map((item) => ({ title: item.title, type: "Exposition", href: "/collections#expositions" })),
    ...videos.map((item) => ({ title: item.title, type: "Vidéo", href: "/collections#videotheque" })),
    ...historicalFigures.map((item) => ({ title: item.name, type: "Figure historique", href: "/recits#figures-historiques" })),
    ...destinations.map((item) => ({ title: item.title, type: "Destination", href: "/exploration#immersions" })),
    ...snapshots.map((item) => ({ title: item.label, type: "Galerie", href: "/collections#galerie" })),
  ];
  const results = query.trim()
    ? searchableItems.filter((item) => String(item.title || "").toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Le menu et la recherche plein écran doivent se refermer automatiquement
  // après une navigation SPA, sans quoi ils resteraient ouverts par-dessus
  // la nouvelle page — un piège fréquent une fois passé à <Link>. On ajuste
  // l'état pendant le rendu (plutôt que dans un effet) pour éviter un aller-
  // retour de rendu inutile : voir https://react.dev/learn/you-might-not-need-an-effect
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled ? "border-ink/10 bg-cream/90 text-ink backdrop-blur-xl" : "border-white/15 bg-ink/35 text-cream backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-5 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <TerangaMark size={36} />
          <span className="leading-tight">
            <span className={`block font-display text-lg font-semibold tracking-wide ${scrolled ? "text-ink" : "text-cream"}`}>
              TÉRANGA
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.15em] text-terracotta">
              PATRIMOINE SÉNÉGALAIS
            </span>
          </span>
        </Link>

        <nav className="nav-scroll hidden min-w-0 flex-1 items-center justify-start gap-1 overflow-x-auto lg:flex xl:justify-center" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                link.href === location.pathname
                  ? "bg-terracotta text-cream"
                  : scrolled
                    ? "text-ink/65 hover:bg-ink/5 hover:text-terracotta"
                    : "text-cream/75 hover:bg-white/10 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <div className="flex items-center gap-1 text-xs font-semibold text-ink/60">
                <button className="rounded px-1.5 py-0.5 text-gold">FR</button>
            <span aria-hidden="true">/</span>
            <button className="rounded px-1.5 py-0.5 hover:text-terracotta">EN</button>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors hover:border-gold hover:text-gold ${scrolled ? "border-ink/15 bg-white/50 text-ink/60" : "border-white/25 bg-black/15 text-cream/75"}`}
            aria-label="Rechercher"
          >
            <Search size={15} />
            <span>Rechercher…</span>
          </button>
        </div>

        <button
        className="ml-auto min-h-11 min-w-11 p-2 lg:hidden"
          onClick={() => { vibrate(8); setOpen(!open); }}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-ink/10 bg-cream px-6 py-4 lg:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center text-base font-medium ${
                    link.href === location.pathname ? "text-terracotta" : "text-ink/80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {searchOpen && <div className="fixed inset-0 z-[60] bg-black/60 p-5" role="dialog" aria-modal="true" aria-label="Recherche globale">
        <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded bg-cream shadow-2xl">
          <div className="flex items-center gap-3 border-b border-ink/10 p-4"><Search size={19} className="text-terracotta" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une exposition, une vidéo, une figure..." className="flex-1 bg-transparent text-sm text-ink outline-none" /><button type="button" onClick={() => setSearchOpen(false)} aria-label="Fermer la recherche"><X size={20} /></button></div>
          <div className="max-h-[60vh] overflow-auto p-3">{!query.trim() && <p className="p-5 text-sm text-ink/45">Tapez pour rechercher une exposition, une vidéo, une figure historique...</p>}{query.trim() && results.length === 0 && <p className="p-5 text-sm text-ink/60">Aucun résultat pour « {query} ».</p>}{results.map((item) => <Link key={`${item.type}-${item.title}`} to={item.href} onClick={() => { setSearchOpen(false); setQuery(""); }} className="flex min-h-12 items-center justify-between rounded p-3 hover:bg-cream-dark"><span className="text-sm font-semibold text-ink">{item.title}</span><span className="text-xs text-terracotta">{item.type}</span></Link>)}</div>
        </div>
      </div>}
    </header>
  );
}
