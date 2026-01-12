export function PokeBowlSVG({ eatenPercent, value }) {
  // Food level decreases as eaten
  const foodLevel = 1 - eatenPercent

  return (
    <>
      <defs>
        {/* Bowl gradient */}
        <linearGradient id="poke-bowl-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Rice gradient */}
        <linearGradient id="poke-rice-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEFEFE" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>

        {/* Salmon gradient */}
        <linearGradient id="poke-salmon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA07A" />
          <stop offset="100%" stopColor="#FA8072" />
        </linearGradient>

        {/* Tuna gradient */}
        <linearGradient id="poke-tuna-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CD5C5C" />
          <stop offset="100%" stopColor="#B22222" />
        </linearGradient>
      </defs>

      {/* Bowl shadow */}
      <ellipse cx="50" cy="88" rx="38" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Bowl base */}
      <ellipse cx="50" cy="75" rx="42" ry="12" fill="url(#poke-bowl-gradient)" />

      {/* Bowl rim */}
      <ellipse cx="50" cy="28" rx="42" ry="14" fill="url(#poke-bowl-gradient)" />

      {/* Bowl inner rim */}
      <ellipse cx="50" cy="30" rx="38" ry="11" fill="#4E342E" />

      {/* Bowl sides */}
      <path
        d="M 8 28 Q 8 75 50 75 Q 92 75 92 28"
        fill="url(#poke-bowl-gradient)"
      />

      {/* Inner bowl area */}
      <ellipse cx="50" cy="32" rx="36" ry="10" fill="#3E2723" />

      {/* Rice base - always visible when there's food */}
      {foodLevel > 0.1 && (
        <ellipse
          cx="50"
          cy={45 + (1 - foodLevel) * 8}
          rx={32 * Math.min(foodLevel + 0.3, 1)}
          ry={12 * Math.min(foodLevel + 0.3, 1)}
          fill="url(#poke-rice-gradient)"
        />
      )}

      {/* Toppings - disappear as eaten */}
      {foodLevel > 0.15 && (
        <g opacity={Math.min(foodLevel * 1.5, 1)}>
          {/* Salmon cubes - left section */}
          {foodLevel > 0.3 && (
            <g>
              <rect x="25" y="38" width="8" height="8" rx="1" fill="url(#poke-salmon-gradient)" transform="rotate(-10 29 42)" />
              <rect x="32" y="42" width="7" height="7" rx="1" fill="url(#poke-salmon-gradient)" transform="rotate(5 35 45)" />
              <rect x="22" y="45" width="6" height="6" rx="1" fill="#FFA07A" transform="rotate(-5 25 48)" />
            </g>
          )}

          {/* Tuna cubes - right section */}
          {foodLevel > 0.4 && (
            <g>
              <rect x="62" y="38" width="8" height="8" rx="1" fill="url(#poke-tuna-gradient)" transform="rotate(10 66 42)" />
              <rect x="68" y="44" width="7" height="7" rx="1" fill="url(#poke-tuna-gradient)" transform="rotate(-5 71 47)" />
              <rect x="58" y="46" width="6" height="6" rx="1" fill="#CD5C5C" transform="rotate(8 61 49)" />
            </g>
          )}

          {/* Avocado slices - top */}
          {foodLevel > 0.5 && (
            <g>
              <ellipse cx="45" cy="36" rx="8" ry="4" fill="#9ACD32" transform="rotate(-15 45 36)" />
              <ellipse cx="45" cy="36" rx="6" ry="3" fill="#ADFF2F" transform="rotate(-15 45 36)" opacity="0.7" />
              <ellipse cx="55" cy="35" rx="7" ry="3.5" fill="#9ACD32" transform="rotate(10 55 35)" />
              <ellipse cx="55" cy="35" rx="5" ry="2.5" fill="#ADFF2F" transform="rotate(10 55 35)" opacity="0.7" />
            </g>
          )}

          {/* Edamame */}
          {foodLevel > 0.6 && (
            <g>
              <ellipse cx="40" cy="50" rx="4" ry="2.5" fill="#8FBC8F" />
              <ellipse cx="46" cy="52" rx="3.5" ry="2" fill="#8FBC8F" />
              <ellipse cx="38" cy="54" rx="3" ry="2" fill="#90EE90" />
            </g>
          )}

          {/* Cucumber slices */}
          {foodLevel > 0.5 && (
            <g>
              <circle cx="60" cy="52" r="4" fill="#98FB98" />
              <circle cx="60" cy="52" r="3" fill="#90EE90" />
              <circle cx="60" cy="52" r="1" fill="#F0FFF0" />
              <circle cx="65" cy="55" r="3.5" fill="#98FB98" />
              <circle cx="65" cy="55" r="2.5" fill="#90EE90" />
            </g>
          )}

          {/* Seaweed salad - center */}
          {foodLevel > 0.7 && (
            <g>
              <ellipse cx="50" cy="42" rx="6" ry="3" fill="#2E7D32" />
              <path d="M 46 41 Q 50 38 54 41" fill="none" stroke="#388E3C" strokeWidth="2" />
              <path d="M 47 43 Q 50 46 53 43" fill="none" stroke="#1B5E20" strokeWidth="1.5" />
            </g>
          )}

          {/* Sesame seeds scattered */}
          {foodLevel > 0.4 && (
            <g>
              <ellipse cx="30" cy="40" rx="1.5" ry="0.8" fill="#FFF8E1" />
              <ellipse cx="48" cy="38" rx="1.5" ry="0.8" fill="#FFF8E1" />
              <ellipse cx="70" cy="41" rx="1.5" ry="0.8" fill="#FFF8E1" />
              <ellipse cx="55" cy="50" rx="1.5" ry="0.8" fill="#1A1A1A" />
              <ellipse cx="42" cy="48" rx="1.5" ry="0.8" fill="#1A1A1A" />
              <ellipse cx="62" cy="45" rx="1.5" ry="0.8" fill="#FFF8E1" />
            </g>
          )}

          {/* Green onion garnish */}
          {foodLevel > 0.6 && (
            <g>
              <ellipse cx="35" cy="38" rx="3" ry="1" fill="#4CAF50" />
              <ellipse cx="52" cy="54" rx="2.5" ry="1" fill="#4CAF50" />
              <ellipse cx="68" cy="50" rx="2" ry="0.8" fill="#66BB6A" />
            </g>
          )}
        </g>
      )}

      {/* Chopsticks when eating */}
      {eatenPercent > 0.1 && eatenPercent < 0.9 && (
        <g transform={`translate(${72 + eatenPercent * 10}, ${15}) rotate(${20 + eatenPercent * 15})`}>
          <rect x="-1" y="-25" width="2" height="40" rx="1" fill="#8B4513" />
          <rect x="3" y="-23" width="2" height="38" rx="1" fill="#A0522D" />
          {/* Food in chopsticks */}
          <rect x="-2" y="16" width="6" height="5" rx="1" fill="#FFA07A" />
        </g>
      )}

      {/* Sauce drizzle on top */}
      {foodLevel > 0.8 && (
        <g opacity="0.7">
          <path
            d="M 30 44 Q 40 40 50 44 Q 60 40 70 44"
            fill="none"
            stroke="#5D4037"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Empty bowl shine */}
      {foodLevel <= 0.1 && (
        <ellipse cx="45" cy="50" rx="12" ry="6" fill="#5D4037" opacity="0.3" />
      )}
    </>
  )
}
