export function AppsSVG({ eatenPercent, value }) {
  const itemsRemaining = Math.ceil((1 - eatenPercent) * 8)

  // Mix of mozz sticks and onion rings
  const appPositions = [
    { x: 30, y: 38, rotation: -15, type: 'mozz' },
    { x: 50, y: 35, rotation: 10, type: 'ring' },
    { x: 70, y: 38, rotation: 20, type: 'mozz' },
    { x: 35, y: 50, rotation: 5, type: 'ring' },
    { x: 55, y: 48, rotation: -10, type: 'mozz' },
    { x: 72, y: 52, rotation: 15, type: 'ring' },
    { x: 42, y: 58, rotation: -5, type: 'mozz' },
    { x: 62, y: 60, rotation: 8, type: 'ring' },
  ]

  const renderApp = (pos, index) => {
    if (index >= itemsRemaining) return null

    if (pos.type === 'mozz') {
      // Mozzarella stick
      return (
        <g key={`app-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Breaded exterior */}
          <rect x="-12" y="-4" width="24" height="8" rx="4" fill="#C49A3A" />
          <rect x="-11" y="-3" width="22" height="6" rx="3" fill="#D4AA4A" />

          {/* Breading texture */}
          <ellipse cx="-6" cy="-1" rx="3" ry="2" fill="#B08030" opacity="0.4" />
          <ellipse cx="2" cy="0" rx="4" ry="2" fill="#B08030" opacity="0.3" />
          <ellipse cx="8" cy="-1" rx="3" ry="2" fill="#B08030" opacity="0.4" />

          {/* Crispy highlight */}
          <rect x="-9" y="-2" width="18" height="2" rx="1" fill="#E8C060" opacity="0.4" />

          {/* Cheese pull hint at end */}
          {index === 0 && eatenPercent > 0.1 && (
            <path
              d="M 12 0 Q 16 2 20 0"
              fill="none"
              stroke="#FFFAF0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
        </g>
      )
    } else {
      // Onion ring
      return (
        <g key={`app-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Outer breading */}
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="#C49A3A" />
          {/* Inner hole */}
          <ellipse cx="0" cy="0" rx="5" ry="3" fill="#7D5030" />

          {/* Breading texture */}
          <path
            d="M -8 -3 Q -5 -5 0 -4 Q 5 -5 8 -3"
            fill="none"
            stroke="#D4AA4A"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M -8 3 Q -5 5 0 4 Q 5 5 8 3"
            fill="none"
            stroke="#B08030"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Crispy highlight */}
          <ellipse cx="-4" cy="-2" rx="3" ry="1.5" fill="#E8C060" opacity="0.4" />
        </g>
      )
    }
  }

  return (
    <>
      <defs>
        <linearGradient id="apps-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <radialGradient id="marinara-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#8B0000" />
        </radialGradient>
        <radialGradient id="ranch-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#F0E8E0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="44" ry="7" fill="rgba(0,0,0,0.1)" />

      {/* Plate */}
      <ellipse cx="50" cy="52" rx="46" ry="30" fill="url(#apps-plate-grad)" />
      <ellipse cx="50" cy="52" rx="42" ry="26" fill="#F8F8F8" />
      <ellipse cx="50" cy="52" rx="46" ry="30" fill="none" stroke="#E0E0E0" strokeWidth="2" />

      {/* Parchment paper liner */}
      <ellipse cx="50" cy="50" rx="36" ry="22" fill="#FFF8E7" opacity="0.6" />

      {/* Appetizers */}
      {appPositions.map((pos, index) => renderApp(pos, index))}

      {/* Marinara sauce cup */}
      <g transform="translate(18, 68)">
        <ellipse cx="0" cy="5" rx="9" ry="4" fill="#D0D0D0" />
        <rect x="-9" y="0" width="18" height="6" fill="#E0E0E0" />
        <ellipse cx="0" cy="0" rx="9" ry="4" fill="#D0D0D0" />
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="url(#marinara-grad)" />
        <ellipse cx="-2" cy="-1" rx="2" ry="1" fill="#D33030" opacity="0.4" />
      </g>

      {/* Ranch cup */}
      <g transform="translate(82, 68)">
        <ellipse cx="0" cy="5" rx="9" ry="4" fill="#D0D0D0" />
        <rect x="-9" y="0" width="18" height="6" fill="#E0E0E0" />
        <ellipse cx="0" cy="0" rx="9" ry="4" fill="#D0D0D0" />
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="url(#ranch-grad)" />
        {/* Ranch herbs */}
        <circle cx="-2" cy="0" r="0.5" fill="#228B22" opacity="0.4" />
        <circle cx="2" cy="-1" r="0.4" fill="#228B22" opacity="0.3" />
      </g>

      {/* Parsley garnish */}
      {itemsRemaining > 4 && (
        <g>
          <circle cx="50" cy="68" r="2.5" fill="#228B22" opacity="0.7" />
          <circle cx="53" cy="66" r="2" fill="#2E8B2E" opacity="0.6" />
        </g>
      )}
    </>
  )
}
