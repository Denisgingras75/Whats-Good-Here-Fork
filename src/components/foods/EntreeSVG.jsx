export function EntreeSVG({ eatenPercent, value }) {
  // Different components disappear at different rates
  const showProtein = eatenPercent < 0.7
  const showVeggies = eatenPercent < 0.85
  const showStarch = eatenPercent < 0.9
  const proteinSize = Math.max(0.3, 1 - eatenPercent * 1.2)

  return (
    <>
      <defs>
        <linearGradient id="entree-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <linearGradient id="steak-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="50%" stopColor="#654321" />
          <stop offset="100%" stopColor="#4A3520" />
        </linearGradient>
        <linearGradient id="sauce-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A3520" />
          <stop offset="100%" stopColor="#2C1810" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="86" rx="44" ry="7" fill="rgba(0,0,0,0.1)" />

      {/* Plate */}
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="url(#entree-plate-grad)" />
      <ellipse cx="50" cy="52" rx="42" ry="28" fill="#F8F8F8" />
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="none" stroke="#E0E0E0" strokeWidth="2" />

      {/* Sauce drizzle on plate */}
      {showProtein && (
        <path
          d="M 25 55 Q 35 50 45 55 Q 55 60 65 55 Q 72 52 75 55"
          fill="none"
          stroke="url(#sauce-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}

      {/* Mashed potatoes / starch side */}
      {showStarch && (
        <g transform="translate(72, 55)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#F5F5DC" />
          <ellipse cx="0" cy="-2" rx="12" ry="8" fill="#FFFACD" />
          {/* Butter pat melting */}
          <ellipse cx="0" cy="-4" rx="4" ry="2" fill="#FFD700" opacity="0.7" />
          <path
            d="M 0 -2 Q 2 2 4 5"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Texture lines */}
          <path
            d="M -8 -2 Q -4 0 0 -2 Q 4 -4 8 -2"
            fill="none"
            stroke="#E8E8D0"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      )}

      {/* Vegetables */}
      {showVeggies && (
        <g transform="translate(28, 48)">
          {/* Asparagus spears */}
          <rect x="-8" y="0" width="24" height="3" rx="1.5" fill="#228B22" transform="rotate(-10 4 1.5)" />
          <rect x="-6" y="4" width="22" height="3" rx="1.5" fill="#2E8B2E" transform="rotate(-5 5 5.5)" />
          <rect x="-4" y="8" width="20" height="3" rx="1.5" fill="#228B22" transform="rotate(-8 6 9.5)" />

          {/* Asparagus tips */}
          <ellipse cx="-8" cy="1" rx="2" ry="3" fill="#3CB371" transform="rotate(-10 -8 1)" />
          <ellipse cx="-6" cy="5" rx="2" ry="3" fill="#32CD32" transform="rotate(-5 -6 5)" />
          <ellipse cx="-4" cy="9" rx="2" ry="3" fill="#3CB371" transform="rotate(-8 -4 9)" />

          {/* Cherry tomatoes */}
          <circle cx="18" cy="3" r="4" fill="#FF6347" />
          <circle cx="17" cy="1" r="1.5" fill="#FF7F7F" opacity="0.6" />
          <circle cx="14" cy="10" r="3.5" fill="#FF6347" />
          <circle cx="13" cy="8" r="1" fill="#FF7F7F" opacity="0.6" />
        </g>
      )}

      {/* Main protein - steak */}
      {showProtein && (
        <g transform={`translate(50, 50) scale(${proteinSize})`}>
          {/* Steak base */}
          <path
            d="M -18 -8 Q -22 -4 -20 4 Q -18 12 -8 14 Q 4 16 14 12 Q 22 8 20 0 Q 22 -8 14 -12 Q 4 -14 -8 -12 Q -16 -10 -18 -8"
            fill="url(#steak-grad)"
          />

          {/* Grill marks */}
          <path
            d="M -14 -6 L 10 6"
            stroke="#2C1810"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M -12 0 L 12 10"
            stroke="#2C1810"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M -8 -10 L 14 2"
            stroke="#2C1810"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Seared crust highlight */}
          <path
            d="M -16 -6 Q -10 -10 0 -10 Q 10 -10 16 -6"
            fill="none"
            stroke="#A0522D"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Juicy interior showing (medium rare) */}
          <ellipse cx="2" cy="2" rx="6" ry="4" fill="#CD5C5C" opacity="0.4" />

          {/* Fat marbling */}
          <path
            d="M -10 -4 Q -6 -2 -2 -4"
            fill="none"
            stroke="#F5F5DC"
            strokeWidth="1"
            opacity="0.4"
          />
          <path
            d="M 4 0 Q 8 2 12 0"
            fill="none"
            stroke="#F5F5DC"
            strokeWidth="1"
            opacity="0.4"
          />
        </g>
      )}

      {/* Herb garnish on steak */}
      {showProtein && proteinSize > 0.6 && (
        <g transform="translate(50, 42)">
          <rect x="-3" y="-1" width="8" height="2" rx="1" fill="#228B22" transform="rotate(-15 1 0)" />
          <rect x="0" y="1" width="6" height="1.5" rx="0.75" fill="#2E8B2E" transform="rotate(10 3 1.75)" />
        </g>
      )}

      {/* Knife and fork */}
      {eatenPercent > 0.05 && eatenPercent < 0.95 && (
        <>
          {/* Fork - left side */}
          <g transform="translate(12, 40) rotate(-20)">
            <rect x="-1" y="0" width="2" height="24" rx="1" fill="#C0C0C0" />
            <rect x="-4" y="-8" width="1.5" height="8" rx="0.5" fill="#C0C0C0" />
            <rect x="-1.5" y="-8" width="1.5" height="8" rx="0.5" fill="#C0C0C0" />
            <rect x="1" y="-8" width="1.5" height="8" rx="0.5" fill="#C0C0C0" />
            <rect x="3.5" y="-8" width="1.5" height="8" rx="0.5" fill="#C0C0C0" />
          </g>

          {/* Knife - right side */}
          <g transform="translate(88, 42) rotate(20)">
            <rect x="-1.5" y="0" width="3" height="22" rx="1.5" fill="#B0B0B0" />
            <path d="M -1.5 -10 L 1.5 -10 L 2 0 L -2 0 Z" fill="#D0D0D0" />
            <path d="M 1.5 -10 Q 3 -5 2 0" fill="#C0C0C0" />
          </g>
        </>
      )}
    </>
  )
}
