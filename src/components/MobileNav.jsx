import { CalendarDays, Compass, Home, Library, ScrollText } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Collections", href: "/collections", icon: Library },
  { label: "Récits", href: "/recits", icon: ScrollText },
  { label: "Explorer", href: "/exploration", icon: Compass },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(26,39,64,0.08)] backdrop-blur-xl lg:hidden" aria-label="Navigation mobile principale">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map(({ label, href, icon: Icon }) => (
          <NavLink key={href} to={href} end={href === "/"} className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${isActive ? "bg-terracotta text-cream" : "text-ink/55 hover:bg-ink/5 hover:text-ink"}`}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
