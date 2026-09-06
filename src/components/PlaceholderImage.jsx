// Placeholder visuel en attendant les vraies photographies.
// Remplacer <PlaceholderImage label="..." /> par une balise <img src="..." /> classique
// une fois les photos du patrimoine sénégalais disponibles.
const PALETTES = {
  terracotta: "from-[#C1440E] via-[#8A3410] to-[#3D1B0E]",
  ink: "from-[#2B3C5C] via-[#1A2740] to-[#0E1626]",
  forest: "from-[#2F6B4A] via-[#1E4A34] to-[#0E271A]",
  gold: "from-[#E0B463] via-[#C1440E] to-[#1A2740]",
  dusk: "from-[#E0B463] via-[#C1440E] to-[#2B3C5C]",
};

export default function PlaceholderImage({
  label,
  src = "",
  alt = label,
  palette = "terracotta",
  className = "",
  pattern = true,
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${PALETTES[palette]} ${className}`}
      role="img"
      aria-label={label}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}
      {pattern && (
        <svg
          className="absolute inset-0 h-full w-full opacity-20 mix-blend-overlay"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id={`mudcloth-${label?.replace(/\s+/g, "-")}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 20 L20 0 L40 20 L20 40 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#mudcloth-${label?.replace(/\s+/g, "-")})`}
          />
        </svg>
      )}
      {label && (
        <span className="absolute bottom-3 left-3 right-3 text-xs font-medium tracking-wide text-white/70">
          {label}
        </span>
      )}
    </div>
  );
}
