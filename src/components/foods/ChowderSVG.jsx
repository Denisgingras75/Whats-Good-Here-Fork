export function ChowderSVG({ eatenPercent, value }) {
  // Chowder level decreases as eaten
  const chowderLevel = 1 - eatenPercent
  const showCrackers = eatenPercent < 0.7

  return (
    <>
      <defs>
        <linearGradient id="chowder-bowl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#D0D0D0" />
        </linearGradient>
        <linearGradient id="chowder-soup-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8DC" />
          <stop offset="50%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5B0" />
        </linearGradient>
        <clipPath id="chowder-bowl-clip">
          <ellipse cx="50" cy="55" rx="34" ry="20" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="88" rx="38" ry="6" fill="rgba(0,0,0,0.1)" />

      {/* Bowl - bread bowl style */}
      <ellipse cx="50" cy="75" rx="42" ry="12" fill="#C49A6C" />
      <path
        d="M 8 55 Q 8 75 50 85 Q 92 75 92 55"
        fill="#D4AA7C"
      />
      <ellipse cx="50" cy="55" rx="42" ry="20" fill="url(#chowder-bowl-grad)" />

      {/* Bowl inner rim */}
      <ellipse cx="50" cy="55" rx="36" ry="17" fill="#E8E8E8" />
      <ellipse cx="50" cy="55" rx="34" ry="15" fill="#F0F0F0" />

      {/* Chowder inside bowl - level changes */}
      <g clipPath="url(#chowder-bowl-clip)">
        <ellipse
          cx="50"
          cy={55 + (1 - chowderLevel) * 12}
          rx="34"
          ry={15 * chowderLevel}
          fill="url(#chowder-soup-grad)"
        />

        {/* Chowder surface texture */}
        {chowderLevel > 0.2 && (
          <g opacity={chowderLevel}>
            {/* Cream swirl */}
            <path
              d={`M 30 ${50 + (1 - chowderLevel) * 12} Q 40 ${48 + (1 - chowderLevel) * 12} 50 ${50 + (1 - chowderLevel) * 12} Q 60 ${52 + (1 - chowderLevel) * 12} 70 ${50 + (1 - chowderLevel) * 12}`}
              fill="none"
              stroke="#FFFAF0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Clam chunks */}
            <ellipse cx="35" cy={52 + (1 - chowderLevel) * 10} rx="4" ry="2" fill="#E8D0B8" />
            <ellipse cx="50" cy={50 + (1 - chowderLevel) * 10} rx="3" ry="2" fill="#DCC0A8" />
            <ellipse cx="62" cy={53 + (1 - chowderLevel) * 10} rx="4" ry="2" fill="#E8D0B8" />

            {/* Potato chunks */}
            <rect x="40" y={54 + (1 - chowderLevel) * 10} width="5" height="4" rx="1" fill="#F0E0C8" />
            <rect x="55" y={52 + (1 - chowderLevel) * 10} width="4" height="4" rx="1" fill="#E8D8C0" />
            <rect x="30" y={55 + (1 - chowderLevel) * 10} width="4" height="3" rx="1" fill="#F0E0C8" />

            {/* Black pepper specks */}
            <circle cx="38" cy={51 + (1 - chowderLevel) * 10} r="0.8" fill="#333" opacity="0.5" />
            <circle cx="52" cy={49 + (1 - chowderLevel) * 10} r="0.6" fill="#333" opacity="0.5" />
            <circle cx="65" cy={51 + (1 - chowderLevel) * 10} r="0.7" fill="#333" opacity="0.5" />
            <circle cx="45" cy={53 + (1 - chowderLevel) * 10} r="0.6" fill="#333" opacity="0.4" />

            {/* Parsley flakes */}
            <circle cx="42" cy={50 + (1 - chowderLevel) * 10} r="1" fill="#228B22" opacity="0.6" />
            <circle cx="58" cy={51 + (1 - chowderLevel) * 10} r="0.8" fill="#2E8B2E" opacity="0.5" />
          </g>
        )}
      </g>

      {/* Spoon */}
      {eatenPercent > 0.1 && eatenPercent < 0.95 && (
        <g transform="translate(72, 40) rotate(25)">
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#C0C0C0" />
          <ellipse cx="0" cy="-1" rx="6" ry="3.5" fill="#D8D8D8" />
          <rect x="-2" y="4" width="4" height="20" rx="2" fill="#B0B0B0" />
        </g>
      )}

      {/* Oyster crackers on side */}
      {showCrackers && (
        <g transform="translate(82, 70)">
          <ellipse cx="0" cy="0" rx="4" ry="3" fill="#F5E6C8" />
          <ellipse cx="5" cy="2" rx="4" ry="3" fill="#F0E0C0" />
          <ellipse cx="-3" cy="4" rx="3.5" ry="2.5" fill="#F5E6C8" />
          <ellipse cx="2" cy="5" rx="3" ry="2.5" fill="#EBD8B8" />
          {/* Cracker details */}
          <circle cx="0" cy="0" r="0.8" fill="#D4C4A0" />
          <circle cx="5" cy="2" r="0.8" fill="#D4C4A0" />
        </g>
      )}

      {/* Steam wisps */}
      {chowderLevel > 0.3 && (
        <g opacity={0.3 + chowderLevel * 0.3}>
          <path
            d="M 40 38 Q 38 32 42 28 Q 38 24 40 18"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 50 36 Q 52 30 48 26 Q 52 22 50 16"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 60 38 Q 62 32 58 28 Q 62 24 60 18"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>
      )}
    </>
  )
}
