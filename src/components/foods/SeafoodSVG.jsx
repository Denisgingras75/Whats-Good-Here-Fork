export function SeafoodSVG({ eatenPercent, value }) {
  // Fish gets eaten from left to right - start at 0 so whole fish shows
  const clipX = eatenPercent * 95

  return (
    <>
      <defs>
        <linearGradient id="fish-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <linearGradient id="fish-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A90B8" />
          <stop offset="30%" stopColor="#3A80A8" />
          <stop offset="100%" stopColor="#2A6088" />
        </linearGradient>
        <linearGradient id="fish-belly-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8D8E8" />
          <stop offset="100%" stopColor="#90C0D8" />
        </linearGradient>
        {/* Clip path that reveals from left to right */}
        <clipPath id="fish-flesh-clip">
          <rect x={clipX} y="0" width="100" height="100" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="78" rx="40" ry="5" fill="rgba(0,0,0,0.1)" />

      {/* Plate */}
      <ellipse cx="50" cy="50" rx="46" ry="28" fill="url(#fish-plate-grad)" />
      <ellipse cx="50" cy="50" rx="42" ry="24" fill="#F8F8F8" />
      <ellipse cx="50" cy="50" rx="46" ry="28" fill="none" stroke="#E0E0E0" strokeWidth="2" />

      {/* === FISH SKELETON (always visible, revealed as eaten) === */}
      <g>
        {/* Main spine */}
        <rect x="15" y="48" width="65" height="4" rx="2" fill="#F0EBE5" />
        <rect x="16" y="49" width="63" height="2" rx="1" fill="#FAF8F5" opacity="0.7" />

        {/* Rib bones - top */}
        <g fill="#EBE6E0">
          <rect x="22" y="36" width="3" height="13" rx="1.5" />
          <rect x="30" y="34" width="3" height="15" rx="1.5" />
          <rect x="38" y="33" width="3" height="16" rx="1.5" />
          <rect x="46" y="32" width="3" height="17" rx="1.5" />
          <rect x="54" y="33" width="3" height="16" rx="1.5" />
          <rect x="62" y="34" width="3" height="15" rx="1.5" />
          <rect x="70" y="37" width="3" height="12" rx="1.5" />
        </g>

        {/* Rib bones - bottom */}
        <g fill="#EBE6E0">
          <rect x="22" y="51" width="3" height="11" rx="1.5" />
          <rect x="30" y="51" width="3" height="13" rx="1.5" />
          <rect x="38" y="51" width="3" height="14" rx="1.5" />
          <rect x="46" y="51" width="3" height="15" rx="1.5" />
          <rect x="54" y="51" width="3" height="14" rx="1.5" />
          <rect x="62" y="51" width="3" height="13" rx="1.5" />
          <rect x="70" y="51" width="3" height="10" rx="1.5" />
        </g>

        {/* Head bones - bass skull shape */}
        <path
          d="M 3 48 L 6 42 Q 10 38 14 38 Q 18 40 20 48 Q 18 56 14 58 Q 10 58 6 54 L 3 48"
          fill="#F0EBE5"
        />
        {/* Jaw bones */}
        <path d="M 3 48 Q 1 46 3 44 L 6 42" stroke="#E5E0DA" strokeWidth="2" fill="none" />
        <path d="M 3 48 Q 1 50 3 52 L 6 54" stroke="#E5E0DA" strokeWidth="2" fill="none" />
        {/* Eye socket */}
        <circle cx="12" cy="44" r="4" fill="#E5E0DA" />
        <circle cx="12" cy="44" r="2.5" fill="#D5D0CA" />
        {/* Gill arch bones */}
        <path d="M 18 42 Q 20 48 18 54" stroke="#EBE6E0" strokeWidth="2" fill="none" />

        {/* Tail bones */}
        <g fill="#EBE6E0">
          <rect x="78" y="40" width="10" height="2.5" rx="1.25" transform="rotate(-20 78 41)" />
          <rect x="78" y="46" width="12" height="2.5" rx="1.25" transform="rotate(-8 78 47)" />
          <rect x="78" y="52" width="12" height="2.5" rx="1.25" transform="rotate(8 78 53)" />
          <rect x="78" y="58" width="10" height="2.5" rx="1.25" transform="rotate(20 78 59)" />
        </g>
      </g>

      {/* === FISH FLESH (clipped, disappears left to right) === */}
      <g clipPath="url(#fish-flesh-clip)">
        {/* Bass body - more athletic shape */}
        <path
          d="M 3 48
             L 6 42
             Q 8 38 12 36
             L 18 34
             Q 35 28 55 30
             Q 75 32 85 42
             Q 88 48 85 56
             Q 75 68 55 70
             Q 35 72 18 66
             L 12 62
             Q 6 58 5 54
             L 3 48"
          fill="url(#fish-body-grad)"
        />

        {/* Bass head - distinctive angular shape with large mouth */}
        <path
          d="M 3 48
             L 6 42
             Q 8 38 12 36
             L 18 34
             Q 22 36 24 40
             Q 26 48 24 56
             Q 22 62 18 66
             L 12 62
             Q 6 58 5 54
             L 3 48"
          fill="#3A7898"
        />

        {/* Bass mouth - large and distinctive */}
        <path
          d="M 3 48 Q 0 46 2 44 Q 4 42 6 42"
          stroke="#2A5070"
          strokeWidth="2"
          fill="none"
        />
        {/* Lower jaw */}
        <path
          d="M 3 48 Q 0 50 2 52 Q 4 54 5 54"
          stroke="#2A5070"
          strokeWidth="2"
          fill="none"
        />
        {/* Mouth interior hint */}
        <path
          d="M 2 46 Q 4 48 2 50"
          stroke="#1A3050"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />

        {/* Belly - lighter underside */}
        <path
          d="M 8 56 Q 20 70 50 69 Q 75 66 85 56 Q 72 64 50 65 Q 28 66 8 56"
          fill="url(#fish-belly-grad)"
        />

        {/* Operculum (gill cover) - distinctive bass feature */}
        <path
          d="M 20 38 Q 26 40 28 48 Q 26 56 20 60"
          fill="#3A7090"
          opacity="0.6"
        />
        <path
          d="M 22 40 Q 26 42 27 48 Q 26 54 22 58"
          stroke="#2A5070"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />

        {/* Scales - row 1 */}
        <g opacity="0.35" fill="#2A5878">
          <ellipse cx="32" cy="38" rx="5" ry="4" />
          <ellipse cx="42" cy="36" rx="5" ry="4" />
          <ellipse cx="52" cy="35" rx="5" ry="4" />
          <ellipse cx="62" cy="36" rx="5" ry="4" />
          <ellipse cx="72" cy="38" rx="5" ry="4" />
        </g>
        {/* Scales - row 2 */}
        <g opacity="0.3" fill="#3A6888">
          <ellipse cx="30" cy="45" rx="5" ry="4" />
          <ellipse cx="39" cy="43" rx="5" ry="4" />
          <ellipse cx="48" cy="42" rx="5" ry="4" />
          <ellipse cx="57" cy="42" rx="5" ry="4" />
          <ellipse cx="66" cy="43" rx="5" ry="4" />
          <ellipse cx="75" cy="45" rx="4" ry="3" />
        </g>
        {/* Scales - row 3 */}
        <g opacity="0.25" fill="#4A7898">
          <ellipse cx="32" cy="52" rx="5" ry="4" />
          <ellipse cx="41" cy="50" rx="5" ry="4" />
          <ellipse cx="50" cy="49" rx="5" ry="4" />
          <ellipse cx="59" cy="50" rx="5" ry="4" />
          <ellipse cx="68" cy="52" rx="5" ry="4" />
          <ellipse cx="76" cy="54" rx="4" ry="3" />
        </g>

        {/* Highlight on top */}
        <path
          d="M 25 36 Q 45 30 70 36"
          stroke="#6AB0D0"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />

        {/* Grill marks - charred diagonal lines */}
        <g opacity="0.55">
          <path d="M 24 36 Q 28 50 24 64" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 34 32 Q 38 50 34 68" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 44 30 Q 48 50 44 70" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 54 30 Q 58 50 54 70" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 64 32 Q 68 50 64 68" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 74 36 Q 78 50 74 64" stroke="#1A3040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 82 40 Q 84 50 82 58" stroke="#1A3040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>

        {/* Eye - larger and positioned higher like bass */}
        <circle cx="14" cy="42" r="5" fill="#1A2A3A" />
        <circle cx="14" cy="42" r="3.5" fill="#2A3A4A" />
        <circle cx="12.5" cy="40.5" r="1.5" fill="#FFF" opacity="0.8" />
        {/* Eye ring */}
        <circle cx="14" cy="42" r="5" fill="none" stroke="#4A6878" strokeWidth="0.5" opacity="0.5" />

        {/* Spiny dorsal fin - distinctive bass feature */}
        <path
          d="M 30 34 L 32 20 L 36 34
             M 36 33 L 38 18 L 42 33
             M 42 32 L 44 17 L 48 32
             M 48 31 L 50 16 L 54 31
             M 54 31 L 56 17 L 60 32"
          stroke="#3A80A8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Dorsal fin membrane */}
        <path
          d="M 30 34 Q 32 22 36 34 Q 38 20 42 33 Q 44 19 48 32 Q 50 18 54 31 Q 56 19 60 32"
          fill="#4A90B8"
          opacity="0.7"
        />

        {/* Soft dorsal fin */}
        <path
          d="M 62 32 Q 70 26 78 36 Q 72 30 66 34 Q 64 32 62 32"
          fill="#3A80A8"
        />

        {/* Tail fin - forked like bass */}
        <path
          d="M 85 48 Q 96 34 94 42 Q 92 48 94 54 Q 96 62 85 50"
          fill="#3A80A8"
        />
        {/* Tail fin detail */}
        <path d="M 86 44 Q 90 48 86 52" stroke="#2A6080" strokeWidth="1" fill="none" opacity="0.5" />

        {/* Pectoral fin */}
        <ellipse cx="30" cy="56" rx="8" ry="4" fill="#4A90B8" transform="rotate(-20 30 56)" />

        {/* Pelvic fin */}
        <ellipse cx="38" cy="64" rx="6" ry="3" fill="#4A90B8" transform="rotate(-10 38 64)" />

        {/* Anal fin */}
        <path
          d="M 68 64 Q 75 72 80 64 Q 76 68 72 66 Q 70 65 68 64"
          fill="#3A80A8"
        />

        {/* Lateral line - prominent on bass */}
        <path d="M 28 48 Q 55 46 82 50" stroke="#2A5878" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Dark lateral stripe - bass marking */}
        <path d="M 26 50 Q 55 48 82 52" stroke="#1A4060" strokeWidth="3" fill="none" opacity="0.25" />
      </g>

      {/* Bite edge detail - shows where flesh meets bone */}
      {eatenPercent > 0.05 && eatenPercent < 0.95 && (
        <path
          d={`M ${clipX} 32 L ${clipX} 68`}
          stroke="#C49464"
          strokeWidth="2"
          opacity="0.6"
        />
      )}

      {/* Lemon wedge */}
      <g transform="translate(80, 68)">
        <path d="M 0 0 Q 7 -4 10 2 Q 9 9 2 9 Q -1 5 0 0" fill="#FFF59D" />
        <path d="M 1 1 Q 6 -2 8 2 Q 7 7 2 7 Q 0 4 1 1" fill="#FFEE58" />
        <line x1="2" y1="2" x2="6" y2="1" stroke="#FBC02D" strokeWidth="0.5" />
        <line x1="2" y1="4" x2="6" y2="4" stroke="#FBC02D" strokeWidth="0.5" />
      </g>

      {/* Parsley */}
      <g>
        <circle cx="16" cy="68" r="2.5" fill="#4CAF50" opacity="0.8" />
        <circle cx="20" cy="66" r="2" fill="#66BB6A" opacity="0.7" />
      </g>
    </>
  )
}
