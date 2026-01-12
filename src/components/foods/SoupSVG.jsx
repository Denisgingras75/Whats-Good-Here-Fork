export function SoupSVG({ eatenPercent, value }) {
  // Soup level decreases as eaten
  const soupLevel = 1 - eatenPercent

  return (
    <>
      <defs>
        <linearGradient id="soup-bowl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
        <linearGradient id="soup-broth-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E07020" />
          <stop offset="50%" stopColor="#D06018" />
          <stop offset="100%" stopColor="#C05010" />
        </linearGradient>
        <clipPath id="soup-bowl-clip">
          <ellipse cx="50" cy="52" rx="32" ry="18" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="86" rx="40" ry="6" fill="rgba(0,0,0,0.1)" />

      {/* Bowl base */}
      <ellipse cx="50" cy="72" rx="38" ry="10" fill="#D0D0D0" />

      {/* Bowl body */}
      <path
        d="M 12 52 Q 12 72 50 80 Q 88 72 88 52"
        fill="url(#soup-bowl-grad)"
      />

      {/* Bowl rim */}
      <ellipse cx="50" cy="52" rx="40" ry="20" fill="url(#soup-bowl-grad)" />
      <ellipse cx="50" cy="52" rx="40" ry="20" fill="none" stroke="#C8C8C8" strokeWidth="2" />

      {/* Inner bowl */}
      <ellipse cx="50" cy="52" rx="34" ry="17" fill="#E8E8E8" />
      <ellipse cx="50" cy="52" rx="32" ry="15" fill="#F0F0F0" />

      {/* Soup inside - tomato/minestrone style */}
      <g clipPath="url(#soup-bowl-clip)">
        <ellipse
          cx="50"
          cy={52 + (1 - soupLevel) * 12}
          rx="32"
          ry={15 * soupLevel}
          fill="url(#soup-broth-grad)"
        />

        {/* Soup contents */}
        {soupLevel > 0.2 && (
          <g opacity={soupLevel}>
            {/* Vegetable chunks */}
            <rect x="35" y={50 + (1 - soupLevel) * 10} width="4" height="4" rx="1" fill="#FF6347" opacity="0.8" />
            <rect x="55" y={48 + (1 - soupLevel) * 10} width="5" height="4" rx="1" fill="#228B22" opacity="0.7" />
            <rect x="42" y={52 + (1 - soupLevel) * 10} width="4" height="3" rx="1" fill="#FFA500" opacity="0.8" />
            <rect x="60" y={51 + (1 - soupLevel) * 10} width="3" height="4" rx="1" fill="#32CD32" opacity="0.7" />

            {/* Pasta/noodles */}
            <ellipse cx="38" cy={49 + (1 - soupLevel) * 10} rx="3" ry="2" fill="#F5DEB3" opacity="0.8" />
            <ellipse cx="52" cy={50 + (1 - soupLevel) * 10} rx="3" ry="2" fill="#F5DEB3" opacity="0.7" />
            <ellipse cx="65" cy={52 + (1 - soupLevel) * 10} rx="2.5" ry="1.5" fill="#F5DEB3" opacity="0.8" />

            {/* Bean shapes */}
            <ellipse cx="45" cy={54 + (1 - soupLevel) * 10} rx="3" ry="2" fill="#F0E0C8" opacity="0.8" />
            <ellipse cx="58" cy={53 + (1 - soupLevel) * 10} rx="2.5" ry="1.5" fill="#E8D0B8" opacity="0.7" />

            {/* Herb specks */}
            <circle cx="40" cy={48 + (1 - soupLevel) * 10} r="1" fill="#228B22" opacity="0.6" />
            <circle cx="55" cy={49 + (1 - soupLevel) * 10} r="0.8" fill="#2E8B2E" opacity="0.5" />
            <circle cx="48" cy={51 + (1 - soupLevel) * 10} r="1" fill="#228B22" opacity="0.5" />

            {/* Surface shine */}
            <path
              d={`M 32 ${48 + (1 - soupLevel) * 10} Q 42 ${46 + (1 - soupLevel) * 10} 50 ${48 + (1 - soupLevel) * 10}`}
              fill="none"
              stroke="#FF8040"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        )}
      </g>

      {/* Spoon in bowl */}
      {eatenPercent > 0.1 && eatenPercent < 0.95 && (
        <g transform="translate(70, 38) rotate(20)">
          <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="#C0C0C0" />
          <ellipse cx="0" cy="-1" rx="5" ry="3" fill="#D8D8D8" />
          <rect x="-1.5" y="4" width="3" height="18" rx="1.5" fill="#B0B0B0" />
        </g>
      )}

      {/* Bread/crackers on side */}
      {soupLevel > 0.4 && (
        <g transform="translate(12, 65)">
          {/* Bread slice */}
          <path
            d="M 0 0 Q -2 -8 5 -10 Q 12 -8 10 0 Q 12 5 5 6 Q -2 5 0 0"
            fill="#D4A04A"
          />
          <path
            d="M 1 -1 Q 0 -6 5 -8 Q 10 -6 9 -1 Q 10 3 5 4 Q 0 3 1 -1"
            fill="#F5DEB3"
          />
        </g>
      )}

      {/* Steam */}
      {soupLevel > 0.3 && (
        <g opacity={0.3 + soupLevel * 0.3}>
          <path
            d="M 38 35 Q 36 28 40 24 Q 36 18 38 12"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 50 32 Q 52 26 48 22 Q 52 16 50 10"
            fill="none"
            stroke="#FFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 62 35 Q 64 28 60 24 Q 64 18 62 12"
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
