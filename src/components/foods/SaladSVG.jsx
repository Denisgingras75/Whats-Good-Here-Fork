export function SaladSVG({ eatenPercent, value }) {
  // Salad components disappear progressively
  const saladLevel = 1 - eatenPercent
  const showToppings = eatenPercent < 0.7
  const showCroutons = eatenPercent < 0.5

  return (
    <>
      <defs>
        <linearGradient id="salad-bowl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
        <clipPath id="salad-bowl-clip">
          <ellipse cx="50" cy="52" rx="34" ry="20" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="86" rx="40" ry="6" fill="rgba(0,0,0,0.1)" />

      {/* Wooden bowl */}
      <ellipse cx="50" cy="72" rx="38" ry="10" fill="#5D3A1A" />
      <path
        d="M 12 52 Q 12 72 50 80 Q 88 72 88 52"
        fill="url(#salad-bowl-grad)"
      />
      <ellipse cx="50" cy="52" rx="40" ry="22" fill="url(#salad-bowl-grad)" />

      {/* Bowl inner */}
      <ellipse cx="50" cy="52" rx="36" ry="19" fill="#6B4423" />
      <ellipse cx="50" cy="52" rx="34" ry="17" fill="#7D5030" />

      {/* Salad greens base */}
      <g clipPath="url(#salad-bowl-clip)">
        {saladLevel > 0.1 && (
          <g opacity={saladLevel}>
            {/* Mixed greens - layered */}
            <ellipse cx="50" cy={50 + (1 - saladLevel) * 8} rx="32" ry={14 * saladLevel} fill="#228B22" />
            <ellipse cx="40" cy={48 + (1 - saladLevel) * 8} rx="14" ry={8 * saladLevel} fill="#32CD32" opacity="0.8" />
            <ellipse cx="60" cy={48 + (1 - saladLevel) * 8} rx="12" ry={7 * saladLevel} fill="#90EE90" opacity="0.7" />
            <ellipse cx="50" cy={52 + (1 - saladLevel) * 8} rx="16" ry={6 * saladLevel} fill="#3CB371" opacity="0.8" />

            {/* Lettuce leaf edges */}
            <path
              d={`M 25 ${48 + (1 - saladLevel) * 8} Q 35 ${44 + (1 - saladLevel) * 8} 45 ${48 + (1 - saladLevel) * 8}`}
              fill="none"
              stroke="#2E8B2E"
              strokeWidth="2"
              opacity="0.6"
            />
            <path
              d={`M 55 ${46 + (1 - saladLevel) * 8} Q 65 ${42 + (1 - saladLevel) * 8} 75 ${46 + (1 - saladLevel) * 8}`}
              fill="none"
              stroke="#228B22"
              strokeWidth="2"
              opacity="0.6"
            />
          </g>
        )}

        {/* Toppings */}
        {showToppings && saladLevel > 0.3 && (
          <g opacity={saladLevel}>
            {/* Cherry tomatoes */}
            <circle cx="35" cy={46 + (1 - saladLevel) * 6} r="4" fill="#FF6347" />
            <circle cx="34" cy={44 + (1 - saladLevel) * 6} r="1.5" fill="#FF7F7F" opacity="0.6" />
            <circle cx="62" cy={48 + (1 - saladLevel) * 6} r="3.5" fill="#FF6347" />
            <circle cx="61" cy={46 + (1 - saladLevel) * 6} r="1" fill="#FF7F7F" opacity="0.6" />

            {/* Cucumber slices */}
            <ellipse cx="45" cy={44 + (1 - saladLevel) * 6} rx="4" ry="3" fill="#90EE90" />
            <ellipse cx="45" cy={44 + (1 - saladLevel) * 6} rx="3" ry="2" fill="#98FB98" />
            <ellipse cx="70" cy={50 + (1 - saladLevel) * 6} rx="3.5" ry="2.5" fill="#90EE90" />
            <ellipse cx="70" cy={50 + (1 - saladLevel) * 6} rx="2.5" ry="1.5" fill="#98FB98" />

            {/* Red onion rings */}
            <ellipse cx="55" cy={45 + (1 - saladLevel) * 6} rx="5" ry="2" fill="none" stroke="#8B008B" strokeWidth="1.5" opacity="0.7" />
            <ellipse cx="30" cy={50 + (1 - saladLevel) * 6} rx="4" ry="1.5" fill="none" stroke="#8B008B" strokeWidth="1.5" opacity="0.7" />

            {/* Shredded carrots */}
            <rect x="40" y={48 + (1 - saladLevel) * 6} width="8" height="1.5" rx="0.75" fill="#FF8C00" transform={`rotate(-15 44 ${49 + (1 - saladLevel) * 6})`} />
            <rect x="58" y={52 + (1 - saladLevel) * 6} width="6" height="1.5" rx="0.75" fill="#FFA500" transform={`rotate(10 61 ${53 + (1 - saladLevel) * 6})`} />

            {/* Feta cheese crumbles */}
            <rect x="48" y={42 + (1 - saladLevel) * 6} width="3" height="3" rx="0.5" fill="#FFFAF0" />
            <rect x="38" y={52 + (1 - saladLevel) * 6} width="2.5" height="2.5" rx="0.5" fill="#FFFAF0" />
            <rect x="65" cy={46 + (1 - saladLevel) * 6} width="2" height="2" rx="0.5" fill="#FFFAF0" />
          </g>
        )}

        {/* Croutons */}
        {showCroutons && (
          <g opacity={saladLevel}>
            <rect x="32" y={40 + (1 - saladLevel) * 6} width="5" height="5" rx="1" fill="#D4A04A" transform={`rotate(15 35 ${43 + (1 - saladLevel) * 6})`} />
            <rect x="52" y={38 + (1 - saladLevel) * 6} width="5" height="5" rx="1" fill="#C49A3A" transform={`rotate(-10 55 ${41 + (1 - saladLevel) * 6})`} />
            <rect x="68" y={44 + (1 - saladLevel) * 6} width="4" height="4" rx="1" fill="#D4A04A" transform={`rotate(20 70 ${46 + (1 - saladLevel) * 6})`} />
          </g>
        )}
      </g>

      {/* Dressing drizzle on top */}
      {saladLevel > 0.4 && (
        <path
          d={`M 30 ${46 + (1 - saladLevel) * 6} Q 40 ${44 + (1 - saladLevel) * 6} 50 ${46 + (1 - saladLevel) * 6} Q 60 ${48 + (1 - saladLevel) * 6} 70 ${46 + (1 - saladLevel) * 6}`}
          fill="none"
          stroke="#F5DEB3"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}

      {/* Fork */}
      {eatenPercent > 0.1 && eatenPercent < 0.95 && (
        <g transform="translate(78, 35) rotate(30)">
          <rect x="-1" y="0" width="2" height="22" rx="1" fill="#C0C0C0" />
          <rect x="-4" y="-8" width="2" height="8" rx="0.5" fill="#C0C0C0" />
          <rect x="-1" y="-8" width="2" height="8" rx="0.5" fill="#C0C0C0" />
          <rect x="2" y="-8" width="2" height="8" rx="0.5" fill="#C0C0C0" />
        </g>
      )}
    </>
  )
}
