export function TacoSVG({ eatenPercent, value }) {
  // Calculate bite position - taco eaten from right side
  const biteX = 88 - (eatenPercent * 70)

  // Generate crunchy, cracked bite path for taco shell
  const generateBitePath = (x) => {
    // More jagged for crunchy shell break
    const cracks = [
      { y: 28, depth: 6 + Math.sin(x * 0.4) * 4, jag: 3 },
      { y: 38, depth: 10 + Math.cos(x * 0.3) * 3, jag: -2 },
      { y: 48, depth: 7 + Math.sin(x * 0.5) * 4, jag: 4 },
      { y: 58, depth: 11 + Math.cos(x * 0.4) * 3, jag: -3 },
      { y: 68, depth: 8 + Math.sin(x * 0.6) * 3, jag: 2 },
    ]

    let path = `M ${x} 0 L ${x} 25`
    cracks.forEach((crack, i) => {
      path += ` L ${x - crack.depth} ${crack.y + crack.jag}`
      path += ` L ${x - crack.depth * 0.5} ${crack.y + 4}`
      path += ` L ${x - crack.depth * 0.8} ${crack.y + 7}`
    })
    path += ` L ${x} 80 L ${x} 100 L 0 100 L 0 0 Z`
    return path
  }

  // Falling filling pieces based on eating progress
  const fallingPieces = eatenPercent > 0.1 && eatenPercent < 0.85 ? [
    { type: 'meat', x: biteX - 5 + Math.sin(eatenPercent * 30) * 3, y: 72 + eatenPercent * 15, size: 3, rotation: eatenPercent * 45 },
    { type: 'cheese', x: biteX - 8 + Math.cos(eatenPercent * 25) * 4, y: 75 + eatenPercent * 12, size: 2.5, rotation: -eatenPercent * 30 },
    { type: 'lettuce', x: biteX - 3 + Math.sin(eatenPercent * 20) * 5, y: 70 + eatenPercent * 18, size: 4, rotation: eatenPercent * 60 },
    { type: 'tomato', x: biteX - 10, y: 78 + eatenPercent * 10, size: 2, rotation: eatenPercent * 20 },
  ] : []

  // Shell crack lines that appear as you eat
  const shellCracks = eatenPercent > 0.15 ? [
    { x1: biteX + 5, y1: 35, x2: biteX + 12, y2: 38, opacity: Math.min(eatenPercent * 2, 0.4) },
    { x1: biteX + 8, y1: 55, x2: biteX + 18, y2: 52, opacity: Math.min(eatenPercent * 1.5, 0.3) },
    { x1: biteX + 3, y1: 65, x2: biteX + 10, y2: 68, opacity: Math.min(eatenPercent * 1.8, 0.35) },
  ] : []

  return (
    <>
      <defs>
        <clipPath id="taco-eaten-clip">
          <path d={generateBitePath(biteX)} />
        </clipPath>

        {/* Taco shell gradient */}
        <linearGradient id="shell-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4D03F" />
          <stop offset="50%" stopColor="#E9B824" />
          <stop offset="100%" stopColor="#D4A012" />
        </linearGradient>

        {/* Meat gradient */}
        <linearGradient id="taco-meat-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="50"
        cy="85"
        rx={35 - eatenPercent * 15}
        ry={5 - eatenPercent * 2}
        fill="rgba(0,0,0,0.12)"
        className="transition-all duration-200"
      />

      {/* Main taco with bite clip */}
      <g clipPath="url(#taco-eaten-clip)">
        {/* Back shell half */}
        <path
          d="M 12 70 Q 12 30 50 25 Q 88 30 88 70 L 85 72 Q 50 75 15 72 Z"
          fill="url(#shell-gradient)"
          opacity="0.7"
        />

        {/* Lettuce layer - back */}
        <path
          d="M 18 65 Q 28 58 40 65 Q 52 58 65 65 Q 78 58 85 65 L 82 68 Q 50 72 18 68 Z"
          fill="#4CAF50"
        />

        {/* Tomato pieces */}
        <circle cx="30" cy="55" r="5" fill="#E53935" />
        <circle cx="30" cy="55" r="3.5" fill="#EF5350" />
        <circle cx="50" cy="52" r="6" fill="#E53935" />
        <circle cx="50" cy="52" r="4" fill="#EF5350" />
        <circle cx="70" cy="55" r="5" fill="#E53935" />
        <circle cx="70" cy="55" r="3.5" fill="#EF5350" />

        {/* Seasoned ground beef */}
        <path
          d="M 20 58 Q 35 48 50 55 Q 65 48 80 58 L 78 62 Q 50 68 22 62 Z"
          fill="url(#taco-meat-gradient)"
        />
        {/* Meat texture */}
        <circle cx="32" cy="56" r="3" fill="#6B3E26" />
        <circle cx="45" cy="54" r="4" fill="#7A4A32" />
        <circle cx="58" cy="55" r="3.5" fill="#6B3E26" />
        <circle cx="72" cy="57" r="3" fill="#7A4A32" />

        {/* Cheese shreds */}
        <g>
          <rect x="25" y="48" width="8" height="2" rx="1" fill="#FFD54F" transform="rotate(-15 29 49)" />
          <rect x="38" y="46" width="10" height="2" rx="1" fill="#FFCA28" transform="rotate(10 43 47)" />
          <rect x="52" y="47" width="8" height="2" rx="1" fill="#FFD54F" transform="rotate(-8 56 48)" />
          <rect x="65" y="48" width="9" height="2" rx="1" fill="#FFCA28" transform="rotate(12 69 49)" />
          <rect x="30" y="52" width="6" height="1.5" rx="0.75" fill="#FFE082" transform="rotate(5 33 53)" />
          <rect x="55" y="51" width="7" height="1.5" rx="0.75" fill="#FFE082" transform="rotate(-10 58 52)" />
        </g>

        {/* Sour cream dollops */}
        <ellipse cx="35" cy="45" rx="5" ry="2.5" fill="#FAFAFA" />
        <ellipse cx="55" cy="44" rx="6" ry="3" fill="#FAFAFA" />
        <ellipse cx="73" cy="46" rx="4" ry="2" fill="#F5F5F5" />

        {/* Lettuce layer - front */}
        <path
          d="M 15 62 Q 25 68 38 62 Q 50 68 62 62 Q 75 68 85 62"
          fill="none"
          stroke="#66BB6A"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Front shell half */}
        <path
          d="M 12 70 Q 12 35 50 30 Q 88 35 88 70"
          fill="none"
          stroke="url(#shell-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Shell texture lines */}
        <path
          d="M 20 65 Q 20 45 50 38 Q 80 45 80 65"
          fill="none"
          stroke="#D4A012"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M 25 62 Q 25 48 50 42 Q 75 48 75 62"
          fill="none"
          stroke="#C99A00"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Cilantro garnish */}
        <g>
          <ellipse cx="40" cy="42" rx="3" ry="1.5" fill="#4CAF50" transform="rotate(-20 40 42)" />
          <ellipse cx="60" cy="43" rx="2.5" ry="1.2" fill="#66BB6A" transform="rotate(15 60 43)" />
          <ellipse cx="48" cy="40" rx="2" ry="1" fill="#4CAF50" transform="rotate(-5 48 40)" />
        </g>

        {/* Onion pieces */}
        <circle cx="42" cy="50" r="2" fill="#FAFAFA" opacity="0.8" />
        <circle cx="62" cy="49" r="1.8" fill="#FAFAFA" opacity="0.8" />
        <circle cx="52" cy="48" r="1.5" fill="#F5F5F5" opacity="0.7" />
      </g>

      {/* Shell crack lines */}
      {shellCracks.map((crack, i) => (
        <line
          key={i}
          x1={crack.x1}
          y1={crack.y1}
          x2={crack.x2}
          y2={crack.y2}
          stroke="#C99A00"
          strokeWidth="1"
          opacity={crack.opacity}
        />
      ))}

      {/* Bite edge details */}
      {eatenPercent > 0.05 && eatenPercent < 0.95 && (
        <g>
          {/* Crunchy shell fragments at bite */}
          <path
            d={`M ${biteX} 32 L ${biteX - 4} 35 L ${biteX - 2} 38 L ${biteX - 5} 42`}
            fill="none"
            stroke="#E9B824"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Shell crumb pieces */}
          <circle cx={biteX - 3} cy="75" r="1.5" fill="#F4D03F" opacity="0.7" />
          <circle cx={biteX - 7} cy="78" r="1" fill="#E9B824" opacity="0.6" />
          <circle cx={biteX + 2} cy="76" r="1.2" fill="#D4A012" opacity="0.5" />

          {/* Meat chunks at edge */}
          <ellipse cx={biteX - 3} cy="55" rx="5" ry="3" fill="#8B4513" />
          <ellipse cx={biteX - 5} cy="58" rx="3" ry="2" fill="#6B3E26" />

          {/* Lettuce sticking out */}
          <path
            d={`M ${biteX - 1} 62 Q ${biteX - 6} 60 ${biteX - 9} 63`}
            fill="none"
            stroke="#66BB6A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M ${biteX - 2} 64 Q ${biteX - 5} 66 ${biteX - 8} 64`}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cheese shreds hanging and falling */}
          <path
            d={`M ${biteX} 48 Q ${biteX - 3} 52 ${biteX - 1} 58
               Q ${biteX - 4} 62 ${biteX - 2} 68`}
            fill="none"
            stroke="#FFD54F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M ${biteX - 3} 50 Q ${biteX - 6} 55 ${biteX - 4} 62`}
            fill="none"
            stroke="#FFCA28"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Sour cream drip */}
          <path
            d={`M ${biteX - 2} 45 Q ${biteX - 4} 50 ${biteX - 2} 55`}
            fill="none"
            stroke="#FAFAFA"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Tomato piece at edge */}
          <circle cx={biteX - 4} cy="52" r="3" fill="#E53935" />
          <circle cx={biteX - 4} cy="51" r="1.5" fill="#EF5350" opacity="0.7" />
        </g>
      )}

      {/* Falling filling pieces */}
      {fallingPieces.map((piece, i) => (
        <g key={i} transform={`translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`}>
          {piece.type === 'meat' && (
            <ellipse rx={piece.size} ry={piece.size * 0.7} fill="#8B4513" opacity="0.8" />
          )}
          {piece.type === 'cheese' && (
            <rect x={-piece.size} y={-piece.size / 3} width={piece.size * 2} height={piece.size / 1.5} rx="1" fill="#FFD54F" opacity="0.8" />
          )}
          {piece.type === 'lettuce' && (
            <ellipse rx={piece.size} ry={piece.size * 0.5} fill="#66BB6A" opacity="0.7" />
          )}
          {piece.type === 'tomato' && (
            <circle r={piece.size} fill="#E53935" opacity="0.8" />
          )}
        </g>
      ))}

      {/* Mess on plate/surface */}
      {eatenPercent > 0.2 && (
        <g opacity={eatenPercent * 0.5}>
          <ellipse cx={45 - eatenPercent * 10} cy="88" rx="8" ry="2" fill="#8B4513" opacity="0.15" />
          <circle cx={50 - eatenPercent * 8} cy="87" r="1" fill="#FFD54F" opacity="0.3" />
          <circle cx={55 - eatenPercent * 12} cy="89" r="1.5" fill="#66BB6A" opacity="0.25" />
        </g>
      )}
    </>
  )
}
