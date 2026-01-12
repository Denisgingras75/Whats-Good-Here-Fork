export function WingsSVG({ eatenPercent, value }) {
  const wingsRemaining = Math.ceil((1 - eatenPercent) * 5)

  const wingPositions = [
    { x: 28, y: 40, rotation: -25, type: 'drum' },
    { x: 55, y: 34, rotation: 8, type: 'flat' },
    { x: 76, y: 42, rotation: 20, type: 'drum' },
    { x: 38, y: 56, rotation: -10, type: 'flat' },
    { x: 66, y: 55, rotation: 15, type: 'drum' },
  ]

  // Sauce drips that accumulate as wings are eaten
  const sauceDrips = eatenPercent > 0.1 ? [
    { x: 30 + eatenPercent * 10, y: 70, length: 5 + eatenPercent * 8, delay: 0 },
    { x: 50 + eatenPercent * 5, y: 72, length: 3 + eatenPercent * 6, delay: 0.1 },
    { x: 65 - eatenPercent * 8, y: 71, length: 4 + eatenPercent * 7, delay: 0.2 },
  ] : []

  // Meat scraps on plate as wings are eaten
  const meatScraps = eatenPercent > 0.2 ? [
    { x: 25 + eatenPercent * 5, y: 68, size: 2, rotation: eatenPercent * 30 },
    { x: 70 - eatenPercent * 10, y: 70, size: 1.5, rotation: -eatenPercent * 45 },
    { x: 45, y: 72, size: 1.8, rotation: eatenPercent * 20 },
  ] : []

  const renderWing = (pos, index) => {
    if (index >= wingsRemaining) {
      // Show cleaned bone
      return (
        <g key={`bone-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Bone shadow */}
          <ellipse cx="0" cy="2" rx="14" ry="3" fill="rgba(0,0,0,0.1)" />
          {/* Bone knob left */}
          <ellipse cx="-12" cy="0" rx="5" ry="4" fill="#F5F0E0" />
          <ellipse cx="-12" cy="-1" rx="3" ry="2" fill="#FFFAF5" opacity="0.6" />
          {/* Bone shaft */}
          <rect x="-9" y="-2" width="18" height="4" rx="2" fill="#FAF5E8" />
          <rect x="-8" y="-1" width="16" height="2" fill="#FFFBF0" opacity="0.5" />
          {/* Bone knob right */}
          <ellipse cx="12" cy="0" rx="4" ry="3" fill="#F5F0E0" />
          <ellipse cx="12" cy="-1" rx="2" ry="1.5" fill="#FFFAF5" opacity="0.6" />
          {/* Cartilage bits */}
          <circle cx="-10" cy="1" r="1" fill="#E8E0D0" opacity="0.7" />
          <circle cx="10" cy="1" r="1" fill="#E8E0D0" opacity="0.7" />
        </g>
      )
    }

    if (pos.type === 'drum') {
      // Drumette - looks like a mini drumstick
      return (
        <g key={`wing-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="-2" cy="6" rx="12" ry="4" fill="rgba(0,0,0,0.15)" />

          {/* Main drumette body - deep fried base */}
          <ellipse cx="-4" cy="0" rx="13" ry="10" fill="#8B2500" />

          {/* Sauce coating - glossy buffalo */}
          <ellipse cx="-4" cy="-1" rx="12" ry="9" fill="#C43E00" />

          {/* Meat contours and bumps */}
          <ellipse cx="-10" cy="-3" rx="5" ry="4" fill="#D45000" />
          <ellipse cx="-2" cy="-5" rx="6" ry="4" fill="#D85500" />
          <ellipse cx="4" cy="-2" rx="4" ry="3" fill="#D45000" />

          {/* Lower meat texture */}
          <ellipse cx="-8" cy="3" rx="4" ry="3" fill="#A03000" opacity="0.7" />
          <ellipse cx="0" cy="4" rx="5" ry="3" fill="#982800" opacity="0.6" />

          {/* Sauce pooling in crevices */}
          <path d="M -12 0 Q -8 2 -4 0" stroke="#8B2000" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M -6 4 Q -2 6 2 4" stroke="#8B2000" strokeWidth="1.5" fill="none" opacity="0.4" />

          {/* Glossy sauce highlights */}
          <ellipse cx="-6" cy="-6" rx="5" ry="2.5" fill="#E86830" opacity="0.7" />
          <ellipse cx="2" cy="-4" rx="3" ry="1.5" fill="#FF7040" opacity="0.5" />
          <ellipse cx="-10" cy="-4" rx="2" ry="1" fill="#FF8050" opacity="0.4" />

          {/* Tapered end toward bone */}
          <path d="M 6 -5 Q 12 -3 14 0 Q 12 3 6 5" fill="#B03500" />
          <path d="M 7 -4 Q 11 -2 12 0 Q 11 2 7 4" fill="#C44000" />

          {/* Bone tip sticking out */}
          <ellipse cx="15" cy="0" rx="4" ry="3" fill="#F5F0E0" />
          <ellipse cx="16" cy="-1" rx="2" ry="1.5" fill="#FFFAF5" opacity="0.7" />

          {/* Cartilage ring */}
          <ellipse cx="12" cy="0" rx="2.5" ry="3.5" fill="#E8D8C8" opacity="0.8" />

          {/* Crispy bits */}
          <circle cx="-12" cy="-1" r="1.5" fill="#7B2000" opacity="0.6" />
          <circle cx="-8" cy="5" r="1" fill="#7B2000" opacity="0.5" />
        </g>
      )
    } else {
      // Flat - the wingette with two bones
      return (
        <g key={`wing-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="0" cy="5" rx="16" ry="4" fill="rgba(0,0,0,0.15)" />

          {/* Flat wing body - elongated */}
          <ellipse cx="0" cy="0" rx="17" ry="7" fill="#8B2500" />

          {/* Sauce layer */}
          <ellipse cx="0" cy="-1" rx="16" ry="6" fill="#C43E00" />

          {/* Two bone ridges visible under meat */}
          <path d="M -13 -2 Q 0 -3 13 -2" stroke="#6B1800" strokeWidth="2.5" fill="none" opacity="0.3" />
          <path d="M -13 2 Q 0 3 13 2" stroke="#6B1800" strokeWidth="2.5" fill="none" opacity="0.3" />

          {/* Meat texture bumps */}
          <ellipse cx="-9" cy="-3" rx="5" ry="3" fill="#D45000" />
          <ellipse cx="0" cy="-3" rx="6" ry="3" fill="#D85500" />
          <ellipse cx="9" cy="-2" rx="5" ry="3" fill="#D45000" />

          {/* Lower texture */}
          <ellipse cx="-6" cy="3" rx="4" ry="2" fill="#A03000" opacity="0.6" />
          <ellipse cx="6" cy="3" rx="5" ry="2" fill="#982800" opacity="0.5" />

          {/* Sauce highlights */}
          <ellipse cx="-5" cy="-4" rx="6" ry="2" fill="#E86830" opacity="0.6" />
          <ellipse cx="7" cy="-3" rx="4" ry="1.5" fill="#FF7040" opacity="0.5" />

          {/* Two bone tips showing on one end */}
          <ellipse cx="-16" cy="-2" rx="3.5" ry="2.5" fill="#F5F0E0" />
          <ellipse cx="-16" cy="-2.5" rx="2" ry="1.5" fill="#FFFAF5" opacity="0.6" />
          <ellipse cx="-16" cy="2" rx="3.5" ry="2.5" fill="#F5F0E0" />
          <ellipse cx="-16" cy="1.5" rx="2" ry="1.5" fill="#FFFAF5" opacity="0.6" />

          {/* Crispy edge */}
          <ellipse cx="15" cy="0" rx="3" ry="2" fill="#7B2000" opacity="0.6" />

          {/* Extra sauce drip */}
          <path d="M 10 3 Q 12 5 11 7" stroke="#C43E00" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      )
    }
  }

  return (
    <>
      <defs>
        <linearGradient id="wings-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
        <radialGradient id="sauce-pool-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C43E00" />
          <stop offset="100%" stopColor="#8B2500" />
        </radialGradient>
        <radialGradient id="ranch-cup-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0EBE5" />
        </radialGradient>
        <radialGradient id="blue-cheese-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F8F8F0" />
          <stop offset="100%" stopColor="#E8E8E0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />

      {/* Plate */}
      <ellipse cx="50" cy="54" rx="46" ry="32" fill="url(#wings-plate-grad)" />
      <ellipse cx="50" cy="54" rx="42" ry="28" fill="#F8F8F8" />
      <ellipse cx="50" cy="54" rx="46" ry="32" fill="none" stroke="#D8D8D8" strokeWidth="2" />

      {/* Sauce puddle */}
      {wingsRemaining > 0 && (
        <ellipse cx="50" cy="56" rx="32" ry="18" fill="url(#sauce-pool-grad)" opacity="0.25" />
      )}

      {/* Wings */}
      {wingPositions.map((pos, index) => renderWing(pos, index))}

      {/* Celery & carrots */}
      {wingsRemaining > 2 && (
        <g>
          {/* Celery sticks */}
          <g>
            <rect x="8" y="66" width="22" height="4" rx="2" fill="#90EE90" transform="rotate(-5 19 68)" />
            <line x1="10" y1="68" x2="28" y2="67" stroke="#7CCD7C" strokeWidth="0.8" />
            <rect x="6" y="71" width="20" height="3.5" rx="1.75" fill="#98FB98" transform="rotate(3 16 72.75)" />
            <line x1="8" y1="72.75" x2="24" y2="73.5" stroke="#7CCD7C" strokeWidth="0.6" />
          </g>

          {/* Celery on right */}
          <g>
            <rect x="70" y="64" width="20" height="4" rx="2" fill="#90EE90" transform="rotate(8 80 66)" />
            <line x1="72" y1="66" x2="88" y2="67" stroke="#7CCD7C" strokeWidth="0.8" />
          </g>

          {/* Carrot sticks */}
          <rect x="32" y="72" width="18" height="3" rx="1.5" fill="#FF8C00" transform="rotate(-3 41 73.5)" />
          <rect x="52" y="73" width="16" height="2.5" rx="1.25" fill="#FFA500" transform="rotate(5 60 74.25)" />
        </g>
      )}

      {/* Ranch cup */}
      <g transform="translate(50, 82)">
        <ellipse cx="0" cy="5" rx="11" ry="4.5" fill="#C8C8C8" />
        <rect x="-11" y="-1" width="22" height="7" fill="#D8D8D8" />
        <ellipse cx="0" cy="-1" rx="11" ry="4.5" fill="#E0E0E0" />
        <ellipse cx="0" cy="-1" rx="9" ry="3.5" fill="url(#ranch-cup-grad)" />
        {/* Ranch herbs */}
        <circle cx="-3" cy="-1" r="0.6" fill="#228B22" opacity="0.5" />
        <circle cx="2" cy="-2" r="0.5" fill="#228B22" opacity="0.4" />
        <circle cx="0" cy="0" r="0.4" fill="#228B22" opacity="0.4" />
        {/* Highlight */}
        <ellipse cx="-3" cy="-2" rx="3" ry="1.5" fill="#FFF" opacity="0.3" />
      </g>

      {/* Sauce drips on plate - accumulate as wings are eaten */}
      {sauceDrips.map((drip, i) => (
        <g key={`drip-${i}`}>
          {/* Sauce drip trail */}
          <path
            d={`M ${drip.x} ${drip.y} Q ${drip.x + 1} ${drip.y + drip.length * 0.5} ${drip.x - 1} ${drip.y + drip.length}`}
            fill="none"
            stroke="#C43E00"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Drip pool */}
          <ellipse
            cx={drip.x - 1}
            cy={drip.y + drip.length + 1}
            rx={2 + drip.length * 0.2}
            ry={1 + drip.length * 0.1}
            fill="#C43E00"
            opacity="0.5"
          />
        </g>
      ))}

      {/* Meat scraps left on plate */}
      {meatScraps.map((scrap, i) => (
        <g key={`scrap-${i}`} transform={`translate(${scrap.x}, ${scrap.y}) rotate(${scrap.rotation})`}>
          <ellipse rx={scrap.size} ry={scrap.size * 0.6} fill="#B03500" opacity="0.7" />
          <ellipse rx={scrap.size * 0.6} ry={scrap.size * 0.4} fill="#C44000" opacity="0.5" />
        </g>
      ))}

      {/* Finger sauce smudges on plate edge */}
      {eatenPercent > 0.3 && (
        <g opacity={eatenPercent * 0.4}>
          <ellipse cx="15" cy="75" rx="4" ry="2" fill="#C43E00" opacity="0.3" />
          <ellipse cx="85" cy="74" rx="3" ry="1.5" fill="#C43E00" opacity="0.25" />
        </g>
      )}
    </>
  )
}
