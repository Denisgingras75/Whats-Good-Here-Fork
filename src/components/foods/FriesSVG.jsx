export function FriesSVG({ eatenPercent, value }) {
  // Fries disappear as eaten
  const friesRemaining = Math.ceil((1 - eatenPercent) * 14)

  // Fry positions - scattered pile with variety
  const fryPositions = [
    { x: 28, y: 28, rotation: -30, length: 34, width: 5.5, variant: 0 },
    { x: 48, y: 24, rotation: 12, length: 38, width: 6, variant: 1 },
    { x: 68, y: 26, rotation: -18, length: 32, width: 5, variant: 2 },
    { x: 32, y: 36, rotation: 25, length: 30, width: 5.5, variant: 1 },
    { x: 52, y: 32, rotation: -5, length: 36, width: 6, variant: 0 },
    { x: 72, y: 38, rotation: 22, length: 28, width: 5, variant: 2 },
    { x: 38, y: 44, rotation: -28, length: 32, width: 5.5, variant: 1 },
    { x: 55, y: 42, rotation: 8, length: 34, width: 5.5, variant: 0 },
    { x: 70, y: 48, rotation: -15, length: 30, width: 5, variant: 2 },
    { x: 30, y: 52, rotation: 18, length: 28, width: 5, variant: 1 },
    { x: 48, y: 50, rotation: -10, length: 32, width: 5.5, variant: 0 },
    { x: 65, y: 54, rotation: 15, length: 26, width: 5, variant: 2 },
    { x: 42, y: 56, rotation: 5, length: 24, width: 4.5, variant: 1 },
    { x: 58, y: 58, rotation: -8, length: 22, width: 4.5, variant: 0 },
  ]

  const renderFry = (pos, index) => {
    if (index >= friesRemaining) return null

    // Different golden colors for variety
    const baseColors = ['#E8C830', '#F0D040', '#E0C028']
    const topColors = ['#F4DC50', '#FFEB60', '#F0D848']
    const darkColors = ['#C4A020', '#D0AC28', '#B89818']

    const baseColor = baseColors[pos.variant]
    const topColor = topColors[pos.variant]
    const darkColor = darkColors[pos.variant]

    return (
      <g key={`fry-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
        {/* Fry shadow */}
        <rect
          x={-pos.length / 2}
          y={pos.width / 2}
          width={pos.length}
          height={pos.width / 2}
          rx={pos.width / 4}
          fill="rgba(0,0,0,0.1)"
        />

        {/* Fry base - slightly darker */}
        <rect
          x={-pos.length / 2}
          y={-pos.width / 2}
          width={pos.length}
          height={pos.width}
          rx={pos.width / 3}
          fill={baseColor}
        />

        {/* Fry top surface - lighter golden */}
        <rect
          x={-pos.length / 2 + 1}
          y={-pos.width / 2}
          width={pos.length - 2}
          height={pos.width * 0.6}
          rx={pos.width / 4}
          fill={topColor}
        />

        {/* Crispy darker edges on ends */}
        <ellipse
          cx={-pos.length / 2 + pos.width / 2}
          cy="0"
          rx={pos.width / 2}
          ry={pos.width / 2.5}
          fill={darkColor}
          opacity="0.6"
        />
        <ellipse
          cx={pos.length / 2 - pos.width / 2}
          cy="0"
          rx={pos.width / 2}
          ry={pos.width / 2.5}
          fill={darkColor}
          opacity="0.6"
        />

        {/* Center highlight line */}
        <rect
          x={-pos.length / 2 + pos.width}
          y={-pos.width / 4}
          width={pos.length - pos.width * 2}
          height={pos.width / 3}
          rx={pos.width / 6}
          fill="#FFF8D0"
          opacity="0.4"
        />

        {/* Texture - slight surface variation */}
        <ellipse
          cx={-pos.length / 4}
          cy={-pos.width / 4}
          rx={pos.width}
          ry={pos.width / 3}
          fill={topColor}
          opacity="0.5"
        />
        <ellipse
          cx={pos.length / 4}
          cy={-pos.width / 4}
          rx={pos.width * 0.8}
          ry={pos.width / 3}
          fill={topColor}
          opacity="0.4"
        />

        {/* Dark spots (extra crispy bits) */}
        {index % 3 === 0 && (
          <>
            <circle cx={-pos.length / 3} cy={pos.width / 4} r="1" fill={darkColor} opacity="0.4" />
            <circle cx={pos.length / 4} cy={pos.width / 3} r="0.8" fill={darkColor} opacity="0.3" />
          </>
        )}
      </g>
    )
  }

  return (
    <>
      <defs>
        {/* Container gradient (McDonald's style red fry box) */}
        <linearGradient id="fry-box-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="50%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>

        {/* Ketchup gradient */}
        <radialGradient id="ketchup-gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="50%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="88" rx="38" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Red fry container/box - classic fast food style */}
      <path
        d="M 14 86 L 18 42 L 82 42 L 86 86 Z"
        fill="url(#fry-box-gradient)"
      />

      {/* Container rim - lighter red highlight */}
      <path
        d="M 18 44 L 82 44"
        stroke="#EF5350"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Container inner - darker */}
      <path
        d="M 20 84 L 23 48 L 77 48 L 80 84 Z"
        fill="#C62828"
      />

      {/* White "M" logo area - simplified */}
      <g opacity="0.15">
        <path
          d="M 40 60 L 44 50 L 50 58 L 56 50 L 60 60 L 56 60 L 52 54 L 50 58 L 48 54 L 44 60 Z"
          fill="#FFF"
        />
      </g>

      {/* White decorative stripes on box */}
      <path
        d="M 24 84 L 26 50 L 30 50 L 28 84 Z"
        fill="#FFCDD2"
        opacity="0.3"
      />
      <path
        d="M 70 84 L 72 50 L 76 50 L 74 84 Z"
        fill="#FFCDD2"
        opacity="0.3"
      />

      {/* Fries pile */}
      {fryPositions.map((pos, index) => renderFry(pos, index))}

      {/* Salt crystals scattered on fries */}
      {friesRemaining > 5 && (
        <g>
          <circle cx="38" cy="32" r="1.2" fill="white" opacity="0.9" />
          <circle cx="55" cy="28" r="1" fill="white" opacity="0.85" />
          <circle cx="68" cy="34" r="1.1" fill="white" opacity="0.9" />
          <circle cx="45" cy="40" r="0.9" fill="white" opacity="0.8" />
          <circle cx="62" cy="44" r="1" fill="white" opacity="0.85" />
          <circle cx="32" cy="48" r="1.1" fill="white" opacity="0.9" />
          <circle cx="52" cy="38" r="0.8" fill="white" opacity="0.8" />
          <circle cx="70" cy="52" r="1" fill="white" opacity="0.85" />
          <circle cx="40" cy="54" r="0.9" fill="white" opacity="0.8" />
        </g>
      )}

      {/* Ketchup cup on side */}
      <g transform="translate(88, 70)">
        {/* Cup shadow */}
        <ellipse cx="0" cy="10" rx="11" ry="4" fill="rgba(0,0,0,0.1)" />
        {/* Cup bottom */}
        <ellipse cx="0" cy="9" rx="11" ry="4.5" fill="#D0D0D0" />
        {/* Cup body */}
        <rect x="-11" y="0" width="22" height="10" fill="#E0E0E0" />
        {/* Cup top rim */}
        <ellipse cx="0" cy="0" rx="11" ry="4.5" fill="#E8E8E8" />
        {/* Cup inner rim */}
        <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#D8D8D8" />
        {/* Ketchup */}
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="url(#ketchup-gradient)" />
        {/* Ketchup highlight */}
        <ellipse cx="-2" cy="-1" rx="3" ry="1.5" fill="#EF5350" opacity="0.5" />
      </g>

      {/* A few loose fries near box */}
      {friesRemaining > 8 && (
        <g>
          <rect x="8" y="78" width="18" height="4" rx="2" fill="#E8C830" transform="rotate(-25 17 80)" />
          <rect x="10" y="82" width="14" height="3.5" rx="1.75" fill="#F0D040" transform="rotate(10 17 84)" />
        </g>
      )}
    </>
  )
}
