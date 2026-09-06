/**
 * Emblème Téranga : une porte accueillante (l'hospitalité) traversée par des
 * fibres qui se rejoignent — la transmission des savoirs et des récits.
 * SVG autonome (aucune dépendance à un asset externe), coloré via currentColor
 * pour s'adapter au fond clair ou sombre selon le contexte d'affichage.
 */
export default function TerangaMark({ className = "", size = 36 }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Symbole Téranga"
    >
      <circle cx="20" cy="20" r="19.5" fill="currentColor" className="text-terracotta" />
      <path
        d="M13 27V18.5C13 14.36 16.13 11 20 11C23.87 11 27 14.36 27 18.5V27"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M20 11V16" stroke="var(--color-gold)" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M14.5 27L11.5 30.5" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20 27V30.8" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M25.5 27L28.5 30.5" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
