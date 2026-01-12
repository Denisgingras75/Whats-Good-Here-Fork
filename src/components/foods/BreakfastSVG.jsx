export function BreakfastSVG({ eatenPercent, value }) {
  // Different items disappear at different rates
  const showEggs = eatenPercent < 0.6
  const showBacon = eatenPercent < 0.8
  const showToast = eatenPercent < 0.9
  const showHashbrowns = eatenPercent < 0.7
  const yolkBroken = eatenPercent > 0.3

  return (
    <>
      <defs>
        <linearGradient id="breakfast-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <radialGradient id="egg-yolk-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="44" ry="7" fill="rgba(0,0,0,0.1)" />

      {/* Plate */}
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="url(#breakfast-plate-grad)" />
      <ellipse cx="50" cy="52" rx="42" ry="28" fill="#F8F8F8" />
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="none" stroke="#E0E0E0" strokeWidth="2" />

      {/* Toast - back left */}
      {showToast && (
        <g transform="translate(20, 38)">
          {/* Toast slice */}
          <rect x="0" y="0" width="22" height="24" rx="2" fill="#D4A04A" />
          <rect x="2" y="2" width="18" height="20" rx="1" fill="#F5DEB3" />
          {/* Butter pat */}
          <rect x="6" y="8" width="10" height="6" rx="1" fill="#FFF8DC" />
          <rect x="7" y="9" width="8" height="4" rx="0.5" fill="#FFFACD" opacity="0.8" />
        </g>
      )}

      {/* Hash browns - right side */}
      {showHashbrowns && (
        <g transform="translate(68, 50)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#C49A6C" />
          <ellipse cx="0" cy="-1" rx="12" ry="8" fill="#D4AA7C" />
          {/* Crispy texture */}
          <ellipse cx="-5" cy="-3" rx="4" ry="2" fill="#B08050" opacity="0.6" />
          <ellipse cx="4" cy="-2" rx="3" ry="2" fill="#B08050" opacity="0.5" />
          <ellipse cx="0" cy="2" rx="5" ry="2" fill="#C09060" opacity="0.4" />
          {/* Golden crispy highlights */}
          <ellipse cx="-3" cy="-4" rx="3" ry="1.5" fill="#E8C080" opacity="0.5" />
          <ellipse cx="5" cy="-3" rx="2" ry="1" fill="#E8C080" opacity="0.4" />
        </g>
      )}

      {/* Bacon strips */}
      {showBacon && (
        <g>
          {/* Bacon strip 1 */}
          <path
            d="M 25 58 Q 35 55 45 58 Q 55 61 65 58 Q 75 55 80 58"
            fill="none"
            stroke="#8B0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 25 58 Q 35 55 45 58 Q 55 61 65 58 Q 75 55 80 58"
            fill="none"
            stroke="#CD5C5C"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Fat streaks */}
          <path
            d="M 30 57 L 32 59"
            stroke="#F5DEB3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 50 58 L 52 60"
            stroke="#F5DEB3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 70 57 L 72 59"
            stroke="#F5DEB3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Bacon strip 2 */}
          <path
            d="M 28 66 Q 38 63 48 66 Q 58 69 68 66 Q 75 64 78 66"
            fill="none"
            stroke="#8B0000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 28 66 Q 38 63 48 66 Q 58 69 68 66 Q 75 64 78 66"
            fill="none"
            stroke="#CD5C5C"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Fat streaks */}
          <path
            d="M 35 65 L 37 67"
            stroke="#F5DEB3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 55 66 L 57 68"
            stroke="#F5DEB3"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      )}

      {/* Fried eggs - sunny side up */}
      {showEggs && (
        <g>
          {/* Egg 1 */}
          <g transform="translate(35, 42)">
            {/* Egg white - irregular shape */}
            <path
              d="M 0 0 Q -12 -5 -10 5 Q -14 12 -5 15 Q 5 18 12 12 Q 18 8 15 0 Q 12 -8 5 -8 Q -5 -10 0 0"
              fill="#FAFAFA"
            />
            <path
              d="M 0 0 Q -10 -3 -8 5 Q -12 10 -4 13 Q 4 15 10 10 Q 15 6 12 0 Q 10 -6 4 -6 Q -4 -8 0 0"
              fill="#FFF"
            />
            {/* Yolk */}
            {yolkBroken ? (
              <>
                <ellipse cx="2" cy="3" rx="7" ry="6" fill="url(#egg-yolk-grad)" />
                {/* Broken yolk running */}
                <path
                  d="M 2 6 Q 5 12 8 15"
                  fill="none"
                  stroke="#FFA500"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </>
            ) : (
              <>
                <ellipse cx="2" cy="2" rx="6" ry="5" fill="url(#egg-yolk-grad)" />
                <ellipse cx="0" cy="0" rx="2" ry="1.5" fill="#FFE55C" opacity="0.6" />
              </>
            )}
          </g>

          {/* Egg 2 */}
          <g transform="translate(58, 38)">
            {/* Egg white */}
            <path
              d="M 0 0 Q -10 -6 -8 4 Q -12 10 -3 14 Q 6 16 12 10 Q 16 4 12 -2 Q 8 -8 2 -7 Q -6 -8 0 0"
              fill="#FAFAFA"
            />
            <path
              d="M 0 0 Q -8 -4 -6 4 Q -10 8 -2 11 Q 5 13 10 8 Q 13 3 10 -1 Q 6 -5 2 -5 Q -5 -6 0 0"
              fill="#FFF"
            />
            {/* Yolk */}
            <ellipse cx="2" cy="2" rx="5" ry="4.5" fill="url(#egg-yolk-grad)" />
            <ellipse cx="0" cy="0" rx="1.5" ry="1" fill="#FFE55C" opacity="0.6" />
          </g>
        </g>
      )}

      {/* Pepper specks */}
      {showEggs && (
        <g opacity="0.5">
          <circle cx="38" cy="44" r="0.6" fill="#333" />
          <circle cx="42" cy="40" r="0.5" fill="#333" />
          <circle cx="56" cy="38" r="0.6" fill="#333" />
          <circle cx="62" cy="42" r="0.5" fill="#333" />
        </g>
      )}

      {/* Parsley garnish */}
      {eatenPercent < 0.5 && (
        <g transform="translate(15, 58)">
          <circle cx="0" cy="0" r="2.5" fill="#228B22" opacity="0.8" />
          <circle cx="3" cy="-2" r="2" fill="#2E8B2E" opacity="0.7" />
          <circle cx="-2" cy="2" r="1.5" fill="#228B22" opacity="0.7" />
        </g>
      )}
    </>
  )
}
