export function SushiSVG({ eatenPercent, value }) {
  // Sushi platter with pieces that disappear as eaten
  const piecesRemaining = Math.ceil((1 - eatenPercent) * 6)
  const piecesEaten = 6 - piecesRemaining

  // Sushi piece positions on the plate
  const sushiPieces = [
    { x: 25, y: 35, type: 'salmon', rotation: -10 },
    { x: 50, y: 30, type: 'tuna', rotation: 5 },
    { x: 75, y: 35, type: 'salmon', rotation: -5 },
    { x: 30, y: 55, type: 'tuna', rotation: 8 },
    { x: 55, y: 58, type: 'salmon', rotation: -8 },
    { x: 75, y: 55, type: 'tuna', rotation: 3 },
  ]

  // Scattered rice grains from eaten pieces
  const scatteredRice = piecesEaten > 0 ? [
    ...Array(Math.min(piecesEaten * 3, 12)).fill(0).map((_, i) => ({
      x: 20 + (i * 7) % 60 + Math.sin(i * 2) * 5,
      y: 25 + (i * 11) % 45 + Math.cos(i * 3) * 3,
      size: 1 + Math.random() * 0.5,
    }))
  ] : []

  // Soy sauce drips and splashes
  const soySplashes = eatenPercent > 0.15 ? [
    { x: 35 + eatenPercent * 10, y: 75, size: 2 + eatenPercent * 1.5 },
    { x: 60 - eatenPercent * 8, y: 73, size: 1.5 + eatenPercent },
    { x: 45, y: 78, size: 1.8 },
  ] : []

  // Wasabi usage - gets smaller as pieces eaten
  const wasabiRemaining = Math.max(0.3, 1 - eatenPercent * 0.8)

  // Ginger pile getting smaller
  const gingerRemaining = Math.max(0.2, 1 - eatenPercent * 0.6)

  // Fish flakes that fall
  const fishFlakes = piecesEaten > 0 ? [
    { x: sushiPieces[0].x + 5, y: sushiPieces[0].y + 12, color: '#FFA07A', show: piecesEaten >= 1 },
    { x: sushiPieces[1].x - 3, y: sushiPieces[1].y + 10, color: '#CD5C5C', show: piecesEaten >= 2 },
    { x: sushiPieces[2].x + 2, y: sushiPieces[2].y + 11, color: '#FFA07A', show: piecesEaten >= 3 },
  ].filter(f => f.show) : []

  const renderSushiPiece = (piece, index) => {
    if (index >= piecesRemaining) return null

    const isSalmon = piece.type === 'salmon'

    return (
      <g key={index} transform={`translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`}>
        {/* Rice base shadow */}
        <ellipse cx="1" cy="6" rx="11" ry="5" fill="rgba(0,0,0,0.1)" />
        {/* Rice base */}
        <ellipse cx="0" cy="4" rx="12" ry="6" fill="#FEFEFE" />
        <ellipse cx="0" cy="3" rx="11" ry="5" fill="#F5F5F5" />
        {/* Rice texture - more detailed */}
        <ellipse cx="-5" cy="4" rx="2" ry="1" fill="#EEEEEE" />
        <ellipse cx="-2" cy="5" rx="1.5" ry="0.8" fill="#E8E8E8" />
        <ellipse cx="3" cy="5" rx="2" ry="1" fill="#EEEEEE" />
        <ellipse cx="6" cy="4" rx="1.5" ry="0.8" fill="#E8E8E8" />
        <ellipse cx="0" cy="2" rx="1.5" ry="0.8" fill="#EEEEEE" />
        <ellipse cx="-3" cy="6" rx="1.2" ry="0.6" fill="#E5E5E5" />
        <ellipse cx="4" cy="6" rx="1.2" ry="0.6" fill="#E5E5E5" />

        {/* Fish topping with more detail */}
        <ellipse
          cx="0"
          cy="-2"
          rx="11"
          ry="5"
          fill={isSalmon ? '#FA8072' : '#CD5C5C'}
        />
        <ellipse
          cx="0"
          cy="-3"
          rx="10"
          ry="4"
          fill={isSalmon ? '#FFA07A' : '#E57373'}
        />
        {/* Glossy highlight on fish */}
        <ellipse
          cx="-3"
          cy="-4"
          rx="4"
          ry="1.5"
          fill={isSalmon ? '#FFB89A' : '#EF9A9A'}
          opacity="0.6"
        />

        {/* Fish grain lines - more detailed */}
        <path
          d={`M -8 -2 Q -6 -4 -4 -2 M -3 -3 Q -1 -5 1 -3 M 2 -2 Q 4 -4 6 -2 M 5 -3 Q 7 -5 8 -3`}
          fill="none"
          stroke={isSalmon ? '#FF6347' : '#B71C1C'}
          strokeWidth="0.5"
          opacity="0.35"
        />
        {/* Fat marbling for salmon */}
        {isSalmon && (
          <g opacity="0.25">
            <path d="M -6 -3 Q -4 -2 -2 -3" fill="none" stroke="#FFE4DD" strokeWidth="1" />
            <path d="M 2 -2 Q 4 -3 6 -2" fill="none" stroke="#FFE4DD" strokeWidth="1" />
          </g>
        )}

        {/* Nori wrap (optional on some pieces) */}
        {index % 2 === 0 && (
          <>
            <rect x="-2" y="-6" width="4" height="13" rx="1" fill="#1B5E20" opacity="0.9" />
            {/* Nori texture */}
            <rect x="-1.5" y="-4" width="0.5" height="2" fill="#2E7D32" opacity="0.3" />
            <rect x="0.5" y="-2" width="0.5" height="2" fill="#2E7D32" opacity="0.3" />
          </>
        )}

        {/* Wasabi dab on piece */}
        {index % 3 === 0 && (
          <ellipse cx="0" cy="-1" rx="2" ry="1" fill="#9ACD32" opacity="0.6" />
        )}
      </g>
    )
  }

  return (
    <>
      <defs>
        {/* Plate gradient */}
        <linearGradient id="sushi-plate-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C2C2C" />
          <stop offset="50%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#0D0D0D" />
        </linearGradient>

        {/* Wasabi gradient */}
        <radialGradient id="wasabi-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9ACD32" />
          <stop offset="100%" stopColor="#6B8E23" />
        </radialGradient>

        {/* Ginger gradient */}
        <linearGradient id="ginger-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="100%" stopColor="#FFC0CB" />
        </linearGradient>
      </defs>

      {/* Plate shadow */}
      <ellipse cx="50" cy="85" rx="40" ry="8" fill="rgba(0,0,0,0.2)" />

      {/* Black rectangular sushi plate */}
      <rect x="8" y="20" width="84" height="55" rx="4" fill="url(#sushi-plate-gradient)" />
      {/* Plate rim highlight */}
      <rect x="10" y="22" width="80" height="51" rx="3" fill="none" stroke="#3A3A3A" strokeWidth="1" />

      {/* Plate inner area */}
      <rect x="12" y="24" width="76" height="47" rx="2" fill="#1F1F1F" />

      {/* Decorative line on plate */}
      <line x1="15" y1="70" x2="85" y2="70" stroke="#2A2A2A" strokeWidth="2" />

      {/* Sushi pieces */}
      {sushiPieces.map((piece, index) => renderSushiPiece(piece, index))}

      {/* Scattered rice grains from eaten sushi */}
      {scatteredRice.map((grain, i) => (
        <ellipse
          key={`rice-${i}`}
          cx={grain.x}
          cy={grain.y}
          rx={grain.size}
          ry={grain.size * 0.5}
          fill="#F5F5F5"
          opacity="0.8"
        />
      ))}

      {/* Fish flakes on plate */}
      {fishFlakes.map((flake, i) => (
        <ellipse
          key={`flake-${i}`}
          cx={flake.x}
          cy={flake.y}
          rx="2"
          ry="1"
          fill={flake.color}
          opacity="0.6"
        />
      ))}

      {/* Wasabi dollop - gets smaller as eaten */}
      {piecesRemaining > 0 && (
        <g transform={`translate(20, 68) scale(${wasabiRemaining})`}>
          <ellipse cx="0" cy="0" rx="6" ry="3" fill="url(#wasabi-gradient)" />
          <ellipse cx="-1" cy="-1" rx="2" ry="1" fill="#B8E07C" opacity="0.5" />
        </g>
      )}
      {/* Wasabi smear when mostly eaten */}
      {eatenPercent > 0.5 && (
        <ellipse cx="18" cy="70" rx="3" ry="1" fill="#9ACD32" opacity="0.3" />
      )}

      {/* Pickled ginger pile - gets smaller */}
      {piecesRemaining > 0 && (
        <g transform={`translate(80, 66) scale(${gingerRemaining})`}>
          <ellipse cx="0" cy="1" rx="8" ry="3" fill="url(#ginger-gradient)" opacity="0.9" />
          <ellipse cx="-2" cy="-1" rx="6" ry="2" fill="#FFB6C1" opacity="0.8" />
          <ellipse cx="2" cy="0" rx="5" ry="2" fill="#FFC0CB" opacity="0.7" />
          {/* Individual ginger slices */}
          <path d="M -5 0 Q -3 -2 -1 0" fill="none" stroke="#FF9AA2" strokeWidth="0.5" opacity="0.5" />
          <path d="M 1 1 Q 3 -1 5 1" fill="none" stroke="#FF9AA2" strokeWidth="0.5" opacity="0.5" />
        </g>
      )}
      {/* Scattered ginger pieces */}
      {eatenPercent > 0.3 && (
        <g>
          <ellipse cx="75" cy="70" rx="2" ry="0.8" fill="#FFB6C1" opacity="0.5" />
          <ellipse cx="85" cy="69" rx="1.5" ry="0.6" fill="#FFC0CB" opacity="0.4" />
        </g>
      )}

      {/* Soy sauce drips/splashes on plate */}
      {soySplashes.map((splash, i) => (
        <g key={`soy-${i}`}>
          <ellipse
            cx={splash.x}
            cy={splash.y}
            rx={splash.size}
            ry={splash.size * 0.4}
            fill="#3D1F00"
            opacity="0.4"
          />
          {/* Tiny satellite drops */}
          <circle cx={splash.x + 2} cy={splash.y - 1} r="0.5" fill="#3D1F00" opacity="0.3" />
        </g>
      ))}

      {/* Soy sauce dish */}
      <ellipse cx="50" cy="82" rx="12" ry="4" fill="#2C2C2C" />
      <ellipse cx="50" cy="81" rx="10" ry="3" fill="#1A0A00" />
      {/* Soy sauce - level decreases slightly as eaten */}
      <ellipse cx="50" cy="81" rx={8 - eatenPercent * 1.5} ry={2 - eatenPercent * 0.3} fill="#3D1F00" />
      <ellipse cx="48" cy="80" rx="2" ry="1" fill="#5D2F00" opacity="0.5" />
      {/* Soy sauce drip on edge of dish */}
      {eatenPercent > 0.2 && (
        <path
          d={`M 58 81 Q 60 83 59 86`}
          fill="none"
          stroke="#3D1F00"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}

      {/* Chopsticks with more detail */}
      {eatenPercent > 0.1 && eatenPercent < 0.95 && (
        <g transform={`translate(${60 + eatenPercent * 15}, ${10 - eatenPercent * 5}) rotate(${25 + eatenPercent * 10})`}>
          {/* Chopstick 1 */}
          <rect x="-1" y="-30" width="2" height="45" rx="1" fill="#8B4513" />
          <rect x="-0.5" y="-28" width="1" height="40" fill="#9B5523" opacity="0.5" />
          {/* Chopstick 2 */}
          <rect x="3" y="-28" width="2" height="43" rx="1" fill="#A0522D" />
          <rect x="3.5" y="-26" width="1" height="38" fill="#B0623D" opacity="0.5" />

          {/* Sushi piece being lifted in chopsticks */}
          {piecesRemaining < 6 && (
            <g transform="translate(1, 18)">
              {/* Rice grains falling from lifted piece */}
              <ellipse cx="-3" cy="8" rx="1" ry="0.5" fill="#F5F5F5" opacity="0.7" />
              <ellipse cx="2" cy="10" rx="0.8" ry="0.4" fill="#F5F5F5" opacity="0.6" />
              {/* The sushi piece */}
              <ellipse cx="0" cy="3" rx="6" ry="3" fill="#F5F5F5" />
              <ellipse cx="0" cy="1" rx="5.5" ry="2.5" fill={piecesEaten % 2 === 0 ? '#FFA07A' : '#CD5C5C'} />
              {/* Soy sauce on fish from dipping */}
              <ellipse cx="1" cy="2" rx="3" ry="1.5" fill="#3D1F00" opacity="0.25" />
              {/* Drip of soy sauce falling */}
              <ellipse cx="2" cy="6" rx="0.8" ry="1.2" fill="#3D1F00" opacity="0.4" />
            </g>
          )}

          {/* Rice stuck to chopsticks */}
          <ellipse cx="0" cy="12" rx="1" ry="0.5" fill="#F5F5F5" opacity="0.6" />
          <ellipse cx="4" cy="10" rx="0.8" ry="0.4" fill="#F5F5F5" opacity="0.5" />
        </g>
      )}

      {/* Empty plate state */}
      {piecesRemaining === 0 && (
        <g>
          <text x="50" y="48" textAnchor="middle" fill="#3A3A3A" fontSize="8" fontFamily="sans-serif">
            美味しい
          </text>
          {/* Clean plate shine */}
          <ellipse cx="50" cy="42" rx="20" ry="8" fill="white" opacity="0.05" />
        </g>
      )}

      {/* Mess accumulation on plate edges */}
      {eatenPercent > 0.4 && (
        <g opacity={eatenPercent * 0.4}>
          {/* Soy sauce smudge */}
          <ellipse cx="25" cy="72" rx="3" ry="1" fill="#3D1F00" opacity="0.2" />
          {/* Wasabi smear */}
          <ellipse cx="30" cy="68" rx="2" ry="0.8" fill="#9ACD32" opacity="0.2" />
        </g>
      )}
    </>
  )
}
