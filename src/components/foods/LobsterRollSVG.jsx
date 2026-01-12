export function LobsterRollSVG({ eatenPercent, value }) {
  // Calculate bite position - eaten from right side
  const biteX = 90 - (eatenPercent * 75)

  // Generate irregular, realistic bite path
  const generateBitePath = (x) => {
    // Irregular teeth marks for soft bun and chunky lobster
    const teeth = [
      { y: 22, depth: 5 + Math.sin(x * 0.4) * 3 },
      { y: 32, depth: 9 + Math.cos(x * 0.3) * 4 },
      { y: 42, depth: 7 + Math.sin(x * 0.5) * 3 },
      { y: 52, depth: 10 + Math.cos(x * 0.4) * 4 },
      { y: 62, depth: 6 + Math.sin(x * 0.6) * 3 },
      { y: 70, depth: 8 + Math.cos(x * 0.3) * 2 },
    ]

    let path = `M ${x} 0 L ${x} 18`
    teeth.forEach((tooth, i) => {
      const nextY = i < teeth.length - 1 ? teeth[i + 1].y : 78
      path += ` Q ${x - tooth.depth} ${tooth.y}, ${x - tooth.depth * 0.4} ${(tooth.y + nextY) / 2}`
    })
    path += ` L ${x} 100 L 0 100 L 0 0 Z`
    return path
  }

  // Falling lobster chunks as you eat
  const fallingChunks = eatenPercent > 0.1 && eatenPercent < 0.9 ? [
    { x: biteX - 5 + Math.sin(eatenPercent * 25) * 4, y: 72 + eatenPercent * 12, size: 4, rotation: eatenPercent * 40 },
    { x: biteX - 10 + Math.cos(eatenPercent * 20) * 3, y: 75 + eatenPercent * 8, size: 3, rotation: -eatenPercent * 30 },
    { x: biteX - 3 + Math.sin(eatenPercent * 30) * 2, y: 70 + eatenPercent * 15, size: 2.5, rotation: eatenPercent * 55 },
  ] : []

  // Bun crumbs that fall
  const bunCrumbs = eatenPercent > 0.08 ? [
    { x: biteX - 4, y: 76 + eatenPercent * 5, size: 1.5 },
    { x: biteX - 8, y: 78 + eatenPercent * 3, size: 1 },
    { x: biteX - 2, y: 77 + eatenPercent * 4, size: 1.2 },
    { x: biteX - 12, y: 79 + eatenPercent * 2, size: 0.8 },
  ] : []

  // Mayo drips that accumulate
  const mayoDrips = eatenPercent > 0.15 ? [
    { x: biteX - 3, y: 58, length: 8 + eatenPercent * 12 },
    { x: biteX - 7, y: 55, length: 5 + eatenPercent * 8 },
  ] : []

  // Butter/grease spots on paper tray
  const greaseSpots = eatenPercent > 0.1 ? [
    { x: 30 + eatenPercent * 10, y: 68, size: 3 + eatenPercent * 2 },
    { x: 55 - eatenPercent * 5, y: 70, size: 2 + eatenPercent * 1.5 },
    { x: 70 - eatenPercent * 15, y: 67, size: 2.5 + eatenPercent * 2 },
  ] : []

  return (
    <>
      <defs>
        <clipPath id="lobster-roll-eaten-clip">
          <path d={generateBitePath(biteX)} />
        </clipPath>

        {/* Bun gradient - New England style split-top */}
        <linearGradient id="lobster-bun-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5DEB3" />
          <stop offset="30%" stopColor="#E8D5A8" />
          <stop offset="100%" stopColor="#D4C494" />
        </linearGradient>

        {/* Toasted sides gradient */}
        <linearGradient id="toasted-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A056" />
          <stop offset="100%" stopColor="#C49346" />
        </linearGradient>

        {/* Lobster meat gradient */}
        <linearGradient id="lobster-meat-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA07A" />
          <stop offset="50%" stopColor="#FA8072" />
          <stop offset="100%" stopColor="#E9967A" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="50"
        cy="82"
        rx={38 - eatenPercent * 16}
        ry={5 - eatenPercent * 2}
        fill="rgba(0,0,0,0.12)"
        className="transition-all duration-200"
      />

      {/* Paper boat/tray underneath */}
      <path
        d="M 5 75 L 10 60 L 90 60 L 95 75 Z"
        fill="#FFF8E7"
      />
      <path
        d="M 8 73 L 12 62 L 88 62 L 92 73 Z"
        fill="#F5E6D3"
      />

      {/* Main lobster roll with bite clip */}
      <g clipPath="url(#lobster-roll-eaten-clip)">
        {/* Bun - New England split-top style */}
        {/* Left side of bun */}
        <path
          d="M 10 55 Q 10 35 50 35 Q 50 55 10 55"
          fill="url(#toasted-gradient)"
        />
        {/* Right side of bun */}
        <path
          d="M 90 55 Q 90 35 50 35 Q 50 55 90 55"
          fill="url(#toasted-gradient)"
        />

        {/* Bun interior (white bread showing) */}
        <path
          d="M 15 52 Q 15 40 50 38 Q 85 40 85 52"
          fill="url(#lobster-bun-gradient)"
        />

        {/* Bun bottom */}
        <path
          d="M 10 55 L 10 65 Q 10 72 25 72 L 75 72 Q 90 72 90 65 L 90 55 Q 50 58 10 55"
          fill="url(#toasted-gradient)"
        />

        {/* Butter grilled marks on bun sides */}
        <line x1="15" y1="45" x2="15" y2="55" stroke="#B8862D" strokeWidth="2" opacity="0.3" />
        <line x1="20" y1="43" x2="20" y2="58" stroke="#B8862D" strokeWidth="2" opacity="0.3" />
        <line x1="80" y1="43" x2="80" y2="58" stroke="#B8862D" strokeWidth="2" opacity="0.3" />
        <line x1="85" y1="45" x2="85" y2="55" stroke="#B8862D" strokeWidth="2" opacity="0.3" />

        {/* Lobster meat - chunky pieces piled high */}
        <g>
          {/* Back layer of lobster */}
          <ellipse cx="30" cy="42" rx="12" ry="6" fill="url(#lobster-meat-gradient)" />
          <ellipse cx="50" cy="40" rx="14" ry="7" fill="url(#lobster-meat-gradient)" />
          <ellipse cx="70" cy="42" rx="12" ry="6" fill="url(#lobster-meat-gradient)" />

          {/* Middle layer - bigger chunks */}
          <ellipse cx="25" cy="48" rx="10" ry="5" fill="#FFA07A" />
          <ellipse cx="42" cy="46" rx="12" ry="6" fill="#FFA07A" />
          <ellipse cx="58" cy="45" rx="13" ry="6" fill="#FA8072" />
          <ellipse cx="75" cy="48" rx="10" ry="5" fill="#FFA07A" />

          {/* Front layer - visible chunks */}
          <ellipse cx="35" cy="52" rx="11" ry="5" fill="#FFB6A3" />
          <ellipse cx="52" cy="50" rx="12" ry="5" fill="#FFC4B5" />
          <ellipse cx="68" cy="52" rx="10" ry="5" fill="#FFB6A3" />

          {/* Lobster chunk highlights (showing the meat texture) */}
          <ellipse cx="30" cy="44" rx="4" ry="2" fill="#FFD4C9" opacity="0.6" />
          <ellipse cx="50" cy="42" rx="5" ry="2" fill="#FFD4C9" opacity="0.6" />
          <ellipse cx="70" cy="44" rx="4" ry="2" fill="#FFD4C9" opacity="0.6" />
          <ellipse cx="40" cy="48" rx="3" ry="1.5" fill="#FFE4DD" opacity="0.5" />
          <ellipse cx="60" cy="47" rx="4" ry="2" fill="#FFE4DD" opacity="0.5" />
        </g>

        {/* Mayo/butter drizzle */}
        <path
          d="M 22 50 Q 35 46 50 50 Q 65 46 78 50"
          fill="none"
          stroke="#FFFACD"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Fresh herbs - chives */}
        <g>
          <rect x="28" y="38" width="8" height="1.5" rx="0.75" fill="#4CAF50" transform="rotate(-10 32 39)" />
          <rect x="45" y="36" width="10" height="1.5" rx="0.75" fill="#66BB6A" transform="rotate(5 50 37)" />
          <rect x="65" y="38" width="7" height="1.5" rx="0.75" fill="#4CAF50" transform="rotate(-8 68 39)" />
          <rect x="38" y="42" width="6" height="1.2" rx="0.6" fill="#81C784" transform="rotate(12 41 43)" />
          <rect x="58" y="41" width="5" height="1.2" rx="0.6" fill="#81C784" transform="rotate(-5 60 42)" />
        </g>

        {/* Celery bits (optional Connecticut style) */}
        <circle cx="32" cy="50" r="2" fill="#90EE90" opacity="0.7" />
        <circle cx="55" cy="48" r="1.8" fill="#98FB98" opacity="0.7" />
        <circle cx="72" cy="50" r="1.5" fill="#90EE90" opacity="0.7" />
      </g>

      {/* Lemon wedge on the side */}
      <g transform="translate(82, 68)">
        <path
          d="M 0 0 Q 8 -4 10 5 Q 8 12 0 10 Z"
          fill="#FFF176"
        />
        <path
          d="M 1 1 Q 7 -2 8 5 Q 7 10 1 8 Z"
          fill="#FFEE58"
        />
        {/* Lemon segments */}
        <line x1="2" y1="3" x2="6" y2="2" stroke="#FBC02D" strokeWidth="0.5" />
        <line x1="2" y1="5" x2="7" y2="5" stroke="#FBC02D" strokeWidth="0.5" />
        <line x1="2" y1="7" x2="6" y2="8" stroke="#FBC02D" strokeWidth="0.5" />
      </g>

      {/* Grease spots on paper tray */}
      {greaseSpots.map((spot, i) => (
        <ellipse
          key={`grease-${i}`}
          cx={spot.x}
          cy={spot.y}
          rx={spot.size}
          ry={spot.size * 0.5}
          fill="#F5DEB3"
          opacity={0.25 + eatenPercent * 0.15}
        />
      ))}

      {/* Bite edge details */}
      {eatenPercent > 0.05 && eatenPercent < 0.95 && (
        <g>
          {/* Bun interior at bite - soft white bread */}
          <path
            d={`M ${biteX} 36 Q ${biteX - 5} 42 ${biteX - 3} 48
               Q ${biteX - 6} 54 ${biteX - 2} 60`}
            fill="#FFF8F0"
            stroke="#F5DEB3"
            strokeWidth="1"
            opacity="0.95"
          />
          {/* Bread air pockets */}
          <circle cx={biteX - 3} cy="40" r="1.5" fill="#FFFAF5" opacity="0.7" />
          <circle cx={biteX - 4} cy="48" r="1.2" fill="#FFFAF5" opacity="0.6" />
          <circle cx={biteX - 2} cy="55" r="1" fill="#FFFAF5" opacity="0.7" />

          {/* Multiple lobster meat chunks at edge - showing the chunky texture */}
          <ellipse cx={biteX - 4} cy="44" rx="6" ry="4" fill="#FFA07A" />
          <ellipse cx={biteX - 3} cy="48" rx="5" ry="3.5" fill="#FA8072" />
          <ellipse cx={biteX - 5} cy="52" rx="4" ry="3" fill="#FFB6A3" />
          {/* Lobster meat highlights */}
          <ellipse cx={biteX - 3} cy="43" rx="2" ry="1" fill="#FFD4C9" opacity="0.6" />
          <ellipse cx={biteX - 4} cy="50" rx="1.5" ry="0.8" fill="#FFE4DD" opacity="0.5" />

          {/* Lobster chunk about to fall */}
          <ellipse
            cx={biteX - 2}
            cy={56 + Math.sin(eatenPercent * 40) * 2}
            rx="4"
            ry="2.5"
            fill="#FFA07A"
            opacity={0.8}
          />

          {/* Chive pieces sticking out */}
          <rect
            x={biteX - 8}
            y="41"
            width="6"
            height="1.2"
            rx="0.6"
            fill="#4CAF50"
            transform={`rotate(-15 ${biteX - 5} 41)`}
          />
          <rect
            x={biteX - 6}
            y="46"
            width="5"
            height="1"
            rx="0.5"
            fill="#66BB6A"
            transform={`rotate(10 ${biteX - 3} 46)`}
          />

          {/* Celery bit at edge */}
          <circle cx={biteX - 4} cy="53" r="1.5" fill="#90EE90" opacity="0.8" />
        </g>
      )}

      {/* Mayo drips running down */}
      {mayoDrips.map((drip, i) => (
        <g key={`mayo-${i}`}>
          <path
            d={`M ${drip.x} ${drip.y} Q ${drip.x - 2} ${drip.y + drip.length * 0.5} ${drip.x + 1} ${drip.y + drip.length}`}
            fill="none"
            stroke="#FFFACD"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Mayo blob at end */}
          <ellipse
            cx={drip.x + 1}
            cy={drip.y + drip.length + 2}
            rx="2"
            ry="1.5"
            fill="#FFFACD"
            opacity="0.8"
          />
        </g>
      ))}

      {/* Falling lobster chunks */}
      {fallingChunks.map((chunk, i) => (
        <g key={`chunk-${i}`} transform={`translate(${chunk.x}, ${chunk.y}) rotate(${chunk.rotation})`}>
          <ellipse rx={chunk.size} ry={chunk.size * 0.6} fill="#FFA07A" opacity="0.85" />
          <ellipse rx={chunk.size * 0.6} ry={chunk.size * 0.4} fill="#FFB6A3" opacity="0.6" />
        </g>
      ))}

      {/* Bun crumbs */}
      {bunCrumbs.map((crumb, i) => (
        <circle
          key={`crumb-${i}`}
          cx={crumb.x}
          cy={crumb.y}
          r={crumb.size}
          fill="#E8D5A8"
          opacity={0.7}
        />
      ))}

      {/* Mess on paper tray */}
      {eatenPercent > 0.2 && (
        <g opacity={eatenPercent * 0.5}>
          {/* Mayo smear */}
          <ellipse cx={40 - eatenPercent * 8} cy="72" rx="5" ry="1.5" fill="#FFFACD" opacity="0.3" />
          {/* Tiny lobster bits */}
          <circle cx={50 - eatenPercent * 10} cy="71" r="1" fill="#FFA07A" opacity="0.4" />
          <circle cx={60 - eatenPercent * 12} cy="73" r="0.8" fill="#FA8072" opacity="0.35" />
        </g>
      )}

      {/* Chips on the side (optional) */}
      <g transform="translate(8, 65)" opacity="0.9">
        <ellipse cx="5" cy="5" rx="6" ry="3" fill="#F4D03F" transform="rotate(-20 5 5)" />
        <ellipse cx="0" cy="8" rx="5" ry="2.5" fill="#E9C52A" transform="rotate(10 0 8)" />
        <ellipse cx="8" cy="10" rx="5" ry="2.5" fill="#F4D03F" transform="rotate(-5 8 10)" />
      </g>
    </>
  )
}
