export function TendysSVG({ eatenPercent, value }) {
  const tendersRemaining = Math.ceil((1 - eatenPercent) * 4)

  const tenderPositions = [
    { x: 50, y: 36, rotation: -12 },
    { x: 46, y: 48, rotation: 15 },
    { x: 54, y: 58, rotation: -8 },
    { x: 50, y: 68, rotation: 5 },
  ]

  const renderTender = (pos, index) => {
    if (index >= tendersRemaining) return null

    return (
      <g key={`tender-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
        {/* Shadow under tender */}
        <ellipse cx="0" cy="3" rx="18" ry="5" fill="rgba(0,0,0,0.15)" />

        {/* Base crispy layer - dark brown */}
        <path
          d={`M -20 ${index % 2 === 0 ? '-2' : '0'}
              Q -22 -5 -16 -7
              Q -8 ${index % 2 === 0 ? '-9' : '-8'} 2 -7
              Q 12 -8 18 -5
              Q 22 -2 20 2
              Q 22 6 16 8
              Q 6 ${index % 2 === 0 ? '9' : '7'} -4 8
              Q -14 9 -18 5
              Q -22 2 -20 ${index % 2 === 0 ? '-2' : '0'}`}
          fill="#A67C3D"
        />

        {/* Main breading - golden brown */}
        <path
          d={`M -18 ${index % 2 === 0 ? '-1' : '1'}
              Q -20 -4 -14 -6
              Q -6 ${index % 2 === 0 ? '-8' : '-7'} 3 -6
              Q 12 -7 16 -4
              Q 20 -1 18 2
              Q 20 5 14 7
              Q 5 ${index % 2 === 0 ? '8' : '6'} -3 7
              Q -12 8 -16 4
              Q -20 1 -18 ${index % 2 === 0 ? '-1' : '1'}`}
          fill="#C4943D"
        />

        {/* Top layer - lighter golden */}
        <path
          d={`M -15 0
              Q -17 -3 -12 -5
              Q -4 -6 4 -5
              Q 11 -6 14 -3
              Q 17 0 15 2
              Q 17 4 12 5
              Q 4 6 -3 5
              Q -10 6 -14 3
              Q -17 1 -15 0`}
          fill="#D4A44D"
        />

        {/* Crispy breading bumps - scattered */}
        <ellipse cx="-12" cy="-3" rx="4" ry="2.5" fill="#DEB060" opacity="0.8" />
        <ellipse cx="-5" cy="-4" rx="5" ry="2.5" fill="#D4A050" opacity="0.7" />
        <ellipse cx="5" cy="-3" rx="4" ry="2.5" fill="#DEB060" opacity="0.8" />
        <ellipse cx="12" cy="-2" rx="3.5" ry="2" fill="#D4A050" opacity="0.7" />

        {/* More crispy bumps on sides */}
        <ellipse cx="-14" cy="1" rx="3" ry="2" fill="#C49040" opacity="0.6" />
        <ellipse cx="-8" cy="3" rx="4" ry="2" fill="#C49040" opacity="0.5" />
        <ellipse cx="2" cy="4" rx="5" ry="2" fill="#C49040" opacity="0.6" />
        <ellipse cx="10" cy="3" rx="4" ry="2" fill="#C49040" opacity="0.5" />
        <ellipse cx="15" cy="1" rx="3" ry="2" fill="#C49040" opacity="0.6" />

        {/* Dark crispy edges and crevices */}
        <circle cx="-16" cy="-1" r="2" fill="#8B6914" opacity="0.6" />
        <circle cx="-10" cy="-5" r="1.5" fill="#8B6914" opacity="0.5" />
        <circle cx="0" cy="-5" r="2" fill="#8B6914" opacity="0.4" />
        <circle cx="8" cy="-4" r="1.5" fill="#8B6914" opacity="0.5" />
        <circle cx="16" cy="0" r="2" fill="#8B6914" opacity="0.6" />
        <circle cx="-6" cy="5" r="1.5" fill="#8B6914" opacity="0.5" />
        <circle cx="6" cy="5" r="1.5" fill="#8B6914" opacity="0.5" />

        {/* Highlight - golden shine on top */}
        <path
          d="M -12 -4 Q -4 -6 6 -4 Q 12 -5 14 -3"
          fill="none"
          stroke="#F0C870"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Secondary highlight */}
        <ellipse cx="-2" cy="-3" rx="6" ry="2" fill="#F5D080" opacity="0.3" />

        {/* Tiny crispy crumb details */}
        <circle cx="-13" cy="-4" r="1" fill="#A07020" opacity="0.7" />
        <circle cx="3" cy="-5" r="1.2" fill="#A07020" opacity="0.6" />
        <circle cx="11" cy="-3" r="1" fill="#A07020" opacity="0.7" />
        <circle cx="-8" cy="4" r="1" fill="#E8C060" opacity="0.5" />
        <circle cx="8" cy="3" r="1.2" fill="#E8C060" opacity="0.5" />
      </g>
    )
  }

  return (
    <>
      <defs>
        <linearGradient id="tender-basket-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="50%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>
        <linearGradient id="tender-paper-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="100%" stopColor="#F5EDD8" />
        </linearGradient>
        <radialGradient id="honey-mustard-g" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#E6B800" />
        </radialGradient>
        <radialGradient id="bbq-sauce-g" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6B2D00" />
          <stop offset="100%" stopColor="#3D1A00" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="90" rx="44" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Red basket - 3D effect */}
      <path d="M 6 88 L 10 26 L 90 26 L 94 88 Z" fill="url(#tender-basket-grad)" />

      {/* Basket rim highlight */}
      <path d="M 10 26 L 90 26" stroke="#E53935" strokeWidth="3" />

      {/* Basket texture - weave lines */}
      <g opacity="0.2" stroke="#7B1818" strokeWidth="1.5">
        <line x1="22" y1="28" x2="18" y2="86" />
        <line x1="38" y1="28" x2="36" y2="86" />
        <line x1="54" y1="28" x2="54" y2="86" />
        <line x1="70" y1="28" x2="72" y2="86" />
        <line x1="86" y1="28" x2="90" y2="86" />
        <path d="M 8 42 Q 50 48 92 42" fill="none" />
        <path d="M 8 58 Q 50 64 92 58" fill="none" />
        <path d="M 8 74 Q 50 78 92 74" fill="none" />
      </g>

      {/* Paper liner with checkered pattern */}
      <path d="M 12 84 L 15 30 L 85 30 L 88 84 Z" fill="url(#tender-paper-grad)" />

      {/* Red checkered pattern on paper */}
      <g opacity="0.08">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <rect key={`ch-${i}`} x={18 + i * 7.5} y="32" width="4" height="50" fill="#D32F2F" />
        ))}
      </g>

      {/* Paper liner fold/crinkle lines */}
      <path d="M 20 35 Q 50 32 80 35" stroke="#E8DCC8" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M 18 50 Q 50 47 82 50" stroke="#E8DCC8" strokeWidth="0.5" fill="none" opacity="0.4" />

      {/* Chicken tenders */}
      {tenderPositions.map((pos, index) => renderTender(pos, index))}

      {/* Crinkle-cut fries on side */}
      {tendersRemaining > 1 && (
        <g>
          <rect x="72" y="40" width="5" height="24" rx="1" fill="#E8C030" transform="rotate(18 74 52)" />
          <path d="M 72 42 L 77 42 M 72 46 L 77 46 M 72 50 L 77 50 M 72 54 L 77 54 M 72 58 L 77 58"
                stroke="#D4A820" strokeWidth="1" transform="rotate(18 74 52)" opacity="0.5" />

          <rect x="76" y="36" width="4.5" height="22" rx="1" fill="#F4D840" transform="rotate(10 78 47)" />
          <path d="M 76 38 L 80.5 38 M 76 42 L 80.5 42 M 76 46 L 80.5 46 M 76 50 L 80.5 50"
                stroke="#E0C030" strokeWidth="1" transform="rotate(10 78 47)" opacity="0.5" />

          <rect x="80" y="42" width="4.5" height="20" rx="1" fill="#E8C830" transform="rotate(22 82 52)" />
          <rect x="68" y="46" width="4" height="18" rx="1" fill="#F0D040" transform="rotate(-8 70 55)" />
        </g>
      )}

      {/* Honey mustard cup */}
      <g transform="translate(16, 76)">
        <ellipse cx="0" cy="6" rx="10" ry="4" fill="#C8C8C8" />
        <rect x="-10" y="0" width="20" height="7" fill="#D8D8D8" />
        <ellipse cx="0" cy="0" rx="10" ry="4" fill="#E0E0E0" />
        <ellipse cx="0" cy="0" rx="8" ry="3" fill="url(#honey-mustard-g)" />
        <ellipse cx="-2" cy="-1" rx="3" ry="1.5" fill="#FFF080" opacity="0.4" />
      </g>

      {/* BBQ sauce cup */}
      <g transform="translate(84, 78)">
        <ellipse cx="0" cy="5" rx="9" ry="3.5" fill="#C8C8C8" />
        <rect x="-9" y="0" width="18" height="6" fill="#D8D8D8" />
        <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#E0E0E0" />
        <ellipse cx="0" cy="0" rx="7" ry="2.5" fill="url(#bbq-sauce-g)" />
        <ellipse cx="-2" cy="-1" rx="2" ry="1" fill="#8B4000" opacity="0.4" />
      </g>

      {/* Scattered crumbs */}
      {eatenPercent > 0.1 && eatenPercent < 0.9 && (
        <g>
          <circle cx={28 + eatenPercent * 30} cy={82} r="1.5" fill="#D4A04A" opacity="0.7" />
          <circle cx={52 + eatenPercent * 15} cy={84} r="1" fill="#C4893D" opacity="0.6" />
          <circle cx={40 + eatenPercent * 20} cy={83} r="1.2" fill="#B08030" opacity="0.5" />
        </g>
      )}
    </>
  )
}
