export function BreakfastSandwichSVG({ eatenPercent, value }) {
  // Calculate how far the bite has progressed (from right side)
  const biteX = 90 - (eatenPercent * 75)

  // Generate chomping bite path with curved teeth marks
  const generateBitePath = (x) => {
    const biteDepth = 7

    return `
      M ${x} 0
      L ${x} 15
      Q ${x - biteDepth} 22, ${x} 29
      Q ${x - biteDepth - 2} 38, ${x} 47
      Q ${x - biteDepth} 56, ${x} 65
      Q ${x - biteDepth - 2} 74, ${x} 83
      L ${x} 100
      L 0 100
      L 0 0
      Z
    `
  }

  return (
    <>
      <defs>
        <clipPath id="breakfast-eaten-clip">
          <path d={generateBitePath(biteX)} />
        </clipPath>

        {/* Bagel gradient - golden brown */}
        <linearGradient id="bagel-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="50%" stopColor="#C4893D" />
          <stop offset="100%" stopColor="#A67332" />
        </linearGradient>

        {/* Bagel inner gradient */}
        <linearGradient id="bagel-inner-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>

        {/* Egg yolk gradient */}
        <radialGradient id="yolk-gradient" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFC107" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="50"
        cy="88"
        rx={36 - eatenPercent * 16}
        ry={5 - eatenPercent * 2}
        fill="rgba(0,0,0,0.12)"
        className="transition-all duration-200"
      />

      {/* Main bagel sandwich with bite clip */}
      <g clipPath="url(#breakfast-eaten-clip)">
        {/* Bottom bagel half */}
        <ellipse cx="50" cy="72" rx="38" ry="14" fill="url(#bagel-gradient)" />
        {/* Bottom bagel inner (cut side) */}
        <ellipse cx="50" cy="68" rx="34" ry="10" fill="url(#bagel-inner-gradient)" />
        {/* Bottom bagel hole hint */}
        <ellipse cx="50" cy="72" rx="10" ry="4" fill="#A67332" opacity="0.3" />

        {/* Bacon strips */}
        <g>
          {/* Bacon strip 1 */}
          <path
            d="M 15 58 Q 25 62 35 58 Q 45 62 55 58 Q 65 62 75 58 Q 85 62 88 58"
            fill="none"
            stroke="#8B0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 15 58 Q 25 62 35 58 Q 45 62 55 58 Q 65 62 75 58 Q 85 62 88 58"
            fill="none"
            stroke="#A52A2A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Bacon fat streaks */}
          <path
            d="M 20 58 L 22 58 M 40 58 L 43 58 M 60 58 L 63 58 M 78 58 L 81 58"
            stroke="#F5DEB3"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Bacon strip 2 */}
          <path
            d="M 12 52 Q 22 48 32 52 Q 42 48 52 52 Q 62 48 72 52 Q 82 48 90 52"
            fill="none"
            stroke="#8B0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 12 52 Q 22 48 32 52 Q 42 48 52 52 Q 62 48 72 52 Q 82 48 90 52"
            fill="none"
            stroke="#A52A2A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 18 52 L 21 52 M 38 52 L 41 52 M 58 52 L 61 52 M 76 52 L 79 52"
            stroke="#F5DEB3"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* Fried egg */}
        {/* Egg white */}
        <ellipse cx="50" cy="44" rx="28" ry="10" fill="#FAFAFA" />
        <ellipse cx="45" cy="42" rx="22" ry="8" fill="white" />
        {/* Egg yolk */}
        <ellipse cx="45" cy="42" rx="10" ry="6" fill="url(#yolk-gradient)" />
        <ellipse cx="43" cy="40" rx="3" ry="2" fill="#FFE082" opacity="0.6" />

        {/* Melted cheese */}
        <path
          d="M 10 36 L 90 36 L 88 42 Q 75 48 60 40 Q 45 48 30 40 Q 15 48 12 42 Z"
          fill="#FFC107"
        />
        <path
          d="M 10 36 L 90 36 L 88 40 Q 78 44 65 38 Q 50 44 35 38 Q 20 44 12 40 Z"
          fill="#FFD54F"
        />

        {/* Top bagel half */}
        <ellipse cx="50" cy="28" rx="38" ry="14" fill="url(#bagel-gradient)" />
        {/* Bagel top highlight */}
        <ellipse cx="45" cy="24" rx="20" ry="6" fill="#DEB887" opacity="0.3" />
        {/* Bagel hole */}
        <ellipse cx="50" cy="28" rx="10" ry="5" fill="#A67332" />
        <ellipse cx="50" cy="28" rx="8" ry="4" fill="#8B6914" />

        {/* Everything bagel seeds */}
        <g>
          {/* Sesame seeds */}
          <ellipse cx="30" cy="22" rx="2.5" ry="1.2" fill="#FFF8E1" />
          <ellipse cx="70" cy="22" rx="2.5" ry="1.2" fill="#FFF8E1" />
          <ellipse cx="40" cy="18" rx="2" ry="1" fill="#FFF8E1" />
          <ellipse cx="60" cy="18" rx="2" ry="1" fill="#FFF8E1" />
          <ellipse cx="35" cy="32" rx="2" ry="1" fill="#FFF8E1" />
          <ellipse cx="65" cy="32" rx="2" ry="1" fill="#FFF8E1" />

          {/* Poppy seeds */}
          <circle cx="25" cy="26" r="1" fill="#1A1A1A" />
          <circle cx="45" cy="20" r="1" fill="#1A1A1A" />
          <circle cx="55" cy="34" r="1" fill="#1A1A1A" />
          <circle cx="75" cy="26" r="1" fill="#1A1A1A" />
          <circle cx="38" cy="28" r="0.8" fill="#1A1A1A" />
          <circle cx="62" cy="24" r="0.8" fill="#1A1A1A" />

          {/* Dried onion/garlic flakes */}
          <ellipse cx="32" cy="24" rx="2" ry="1" fill="#E8D5B7" opacity="0.8" />
          <ellipse cx="52" cy="16" rx="1.5" ry="0.8" fill="#E8D5B7" opacity="0.8" />
          <ellipse cx="68" cy="30" rx="2" ry="1" fill="#E8D5B7" opacity="0.8" />
        </g>
      </g>

      {/* Bite edge details */}
      {eatenPercent > 0.05 && eatenPercent < 0.95 && (
        <g>
          {/* Inner bagel texture at bite */}
          <path
            d={`M ${biteX} 20 Q ${biteX - 4} 28 ${biteX} 36`}
            fill="none"
            stroke="#F5DEB3"
            strokeWidth="3"
            opacity="0.9"
          />

          {/* Egg at bite edge */}
          <circle cx={biteX - 2} cy="42" r="4" fill="#FAFAFA" />
          <circle cx={biteX - 3} cy="41" r="2" fill="#FFD54F" />

          {/* Cheese drip */}
          <path
            d={`M ${biteX} 38 Q ${biteX - 5} 42 ${biteX - 3} 48`}
            fill="none"
            stroke="#FFC107"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Bacon edge */}
          <rect x={biteX - 4} y="52" width="5" height="3" rx="1" fill="#A52A2A" />
          <rect x={biteX - 3} y="56" width="4" height="3" rx="1" fill="#8B0000" />
        </g>
      )}
    </>
  )
}
