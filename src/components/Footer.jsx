import { Link } from "react-router-dom";
import { Globe2, Award } from "lucide-react";
import TerangaMark from "./TerangaMark";

/**
 * Chaque lien pointe vers une route + ancre qui existe réellement dans
 * l'application. Un lien sans `to` (soon: true) correspond à une
 * fonctionnalité pas encore construite : il s'affiche desactivé avec un
 * badge "Bientôt" plutôt que de renvoyer vers une page qui n'existe pas.
 * Pour activer un lien plus tard, il suffit d'ajouter son `to`.
 */
const FOOTER_SECTIONS = [
  {
    title: "EXPLORER",
    links: [
      { label: "Collections", to: "/collections" },
      { label: "Expositions", to: "/collections#expositions" },
      { label: "Contes du terroir", to: "/recits#contes" },
      { label: "Médiathèque", to: "/collections#videotheque" },
    ],
  },
  {
    title: "RESSOURCES",
    links: [
      { label: "Archives publiques", to: "/collections#galerie" },
      { label: "Espace Écoles", to: "/exploration#quiz" },
      { label: "Jeux et activités", to: "/#laboratoire" },
      { label: "API & Open Data", soon: true },
    ],
  },
  {
    title: "À PROPOS",
    links: [
      { label: "Le Projet", to: "/#accueil" },
      { label: "Partenaires", soon: true },
      { label: "Comité Scientifique", soon: true },
      { label: "Contact", to: "/agenda#contribution" },
    ],
  },
];

function FooterLink({ link }) {
  if (link.soon) {
    return (
      <span className="flex items-center gap-2 text-sm text-cream/35">
        {link.label}
        <span className="rounded-full border border-cream/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream/45">
          Bientôt
        </span>
      </span>
    );
  }
  return (
    <Link to={link.to} className="text-sm text-cream/70 transition-colors hover:text-cream">
      {link.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/#accueil" className="flex items-center gap-2.5">
              <TerangaMark size={36} />
              <span className="font-display text-lg font-semibold">TÉRANGA</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              La plateforme d'archivage et de médiation culturelle du
              patrimoine national matériel et immatériel de la République
              du Sénégal.
            </p>
          </div>
          {FOOTER_SECTIONS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-[0.15em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/50">
            Avec le haut patronage du Ministère de la Culture et du Patrimoine Historique Classé.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Globe2 size={15} /> UNESCO</span>
            <span className="flex items-center gap-1.5"><Award size={15} /> République du Sénégal</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/10 py-6 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Téranga © 2026. Tous droits réservés.</p>
          <div className="flex gap-6">
            <span className="text-cream/30">Mentions légales</span>
            <span className="text-cream/30">Données personnelles</span>
            <span className="text-cream/30">Crédits</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
