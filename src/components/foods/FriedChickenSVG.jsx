export function FriedChickenSVG({ eatenPercent, value }) {
  const piecesRemaining = Math.ceil((1 - eatenPercent) * 4)

  const piecePositions = [
    { x: 35, y: 40, rotation: -15, type: 'drumstick' },
    { x: 68, y: 38, rotation: 20, type: 'thigh' },
    { x: 38, y: 58, rotation: 8, type: 'breast' },
    { x: 70, y: 56, rotation: -12, type: 'wing' },
  ]

  const renderPiece = (pos, index) => {
    if (index >= piecesRemaining) {
      // Show bone for drumstick
      if (pos.type === 'drumstick') {
        return (
          <g key={`bone-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
            <ellipse cx="0" cy="2" rx="16" ry="4" fill="rgba(0,0,0,0.1)" />
            <ellipse cx="-12" cy="0" rx="5" ry="4" fill="#F5F0E0" />
            <ellipse cx="-12" cy="-1" rx="3" ry="2" fill="#FFFAF5" opacity="0.6" />
            <rect x="-9" y="-2" width="20" height="4" rx="2" fill="#FAF5E8" />
            <ellipse cx="12" cy="0" rx="4" ry="3" fill="#F5F0E0" />
          </g>
        )
      }
      return null
    }

    // Crispy fried chicken pieces with detailed breading
    const shapes = {
      drumstick: (
        <g key={`piece-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="-2" cy="8" rx="14" ry="5" fill="rgba(0,0,0,0.15)" />

          {/* Base - dark crispy layer */}
          <ellipse cx="-4" cy="0" rx="14" ry="11" fill="#8B5A2B" />

          {/* Main breading - golden brown */}
          <ellipse cx="-4" cy="-1" rx="13" ry="10" fill="#A0724A" />

          {/* Top golden layer */}
          <ellipse cx="-4" cy="-2" rx="12" ry="9" fill="#B8864A" />

          {/* Crispy breading texture bumps */}
          <ellipse cx="-10" cy="-4" rx="5" ry="4" fill="#C99A5A" />
          <ellipse cx="-2" cy="-6" rx="6" ry="4" fill="#CDA060" />
          <ellipse cx="5" cy="-3" rx="4" ry="3" fill="#C99A5A" />
          <ellipse cx="-8" cy="2" rx="4" ry="3" fill="#9A6A3A" opacity="0.7" />
          <ellipse cx="0" cy="4" rx="5" ry="3" fill="#8B5A2B" opacity="0.6" />

          {/* More crispy detail bumps */}
          <circle cx="-12" cy="-2" r="2.5" fill="#B58040" opacity="0.7" />
          <circle cx="-6" cy="-7" r="2" fill="#D4A868" opacity="0.6" />
          <circle cx="4" cy="-5" r="2" fill="#D4A868" opacity="0.5" />
          <circle cx="-4" cy="5" r="2" fill="#7A4A20" opacity="0.6" />

          {/* Golden highlights on top */}
          <ellipse cx="-5" cy="-6" rx="5" ry="2" fill="#E0B878" opacity="0.5" />
          <ellipse cx="2" cy="-4" rx="3" ry="1.5" fill="#E8C088" opacity="0.4" />

          {/* Dark crevices */}
          <path d="M -10 0 Q -6 2 -2 0" stroke="#6B4020" strokeWidth="1.5" fill="none" opacity="0.4" />

          {/* Tapered end toward bone */}
          <path d="M 6 -6 Q 12 -4 15 0 Q 12 4 6 6" fill="#9A6A3A" />
          <path d="M 7 -5 Q 11 -3 13 0 Q 11 3 7 5" fill="#A8784A" />

          {/* Bone tip */}
          <ellipse cx="16" cy="0" rx="4" ry="3" fill="#F5F0E0" />
          <ellipse cx="17" cy="-1" rx="2" ry="1.5" fill="#FFFAF5" opacity="0.7" />

          {/* Cartilage ring */}
          <ellipse cx="13" cy="0" rx="2.5" ry="4" fill="#E8D8C8" opacity="0.8" />
        </g>
      ),
      thigh: (
        <g key={`piece-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="0" cy="8" rx="16" ry="5" fill="rgba(0,0,0,0.15)" />

          {/* Thigh - larger irregular shape */}
          <path
            d="M -14 0 Q -16 -10 -6 -12 Q 6 -12 14 -6 Q 18 0 14 6 Q 8 12 -2 12 Q -12 10 -14 4 Q -16 2 -14 0"
            fill="#8B5A2B"
          />
          <path
            d="M -12 0 Q -14 -8 -5 -10 Q 5 -10 12 -5 Q 16 0 12 5 Q 7 10 -1 10 Q -10 8 -12 3 Q -14 1 -12 0"
            fill="#A0724A"
          />
          <path
            d="M -10 0 Q -12 -6 -4 -8 Q 4 -8 10 -4 Q 14 0 10 4 Q 6 8 0 8 Q -8 6 -10 2 Q -12 0 -10 0"
            fill="#B8864A"
          />

          {/* Crispy bumps all over */}
          <ellipse cx="-6" cy="-5" rx="5" ry="4" fill="#C99A5A" />
          <ellipse cx="4" cy="-6" rx="6" ry="4" fill="#CDA060" />
          <ellipse cx="10" cy="-2" rx="4" ry="3" fill="#C99A5A" />
          <ellipse cx="-8" cy="3" rx="4" ry="3" fill="#9A6A3A" opacity="0.7" />
          <ellipse cx="2" cy="5" rx="5" ry="3" fill="#8B5A2B" opacity="0.6" />
          <ellipse cx="8" cy="3" rx="4" ry="2.5" fill="#9A6A3A" opacity="0.6" />

          {/* Extra detail */}
          <circle cx="-10" cy="-3" r="2.5" fill="#B58040" opacity="0.6" />
          <circle cx="0" cy="-7" r="2" fill="#D4A868" opacity="0.5" />
          <circle cx="8" cy="-4" r="2" fill="#D4A868" opacity="0.5" />

          {/* Golden highlights */}
          <ellipse cx="-2" cy="-7" rx="6" ry="2.5" fill="#E0B878" opacity="0.5" />
          <ellipse cx="8" cy="-4" rx="4" ry="1.5" fill="#E8C088" opacity="0.4" />
        </g>
      ),
      breast: (
        <g key={`piece-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="0" cy="8" rx="18" ry="5" fill="rgba(0,0,0,0.15)" />

          {/* Breast - large rounded piece */}
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="#8B5A2B" />
          <ellipse cx="0" cy="-1" rx="17" ry="11" fill="#A0724A" />
          <ellipse cx="0" cy="-2" rx="16" ry="10" fill="#B8864A" />

          {/* Crispy breading bumps - lots of them */}
          <ellipse cx="-10" cy="-5" rx="6" ry="4" fill="#C99A5A" />
          <ellipse cx="0" cy="-7" rx="7" ry="4" fill="#CDA060" />
          <ellipse cx="10" cy="-5" rx="6" ry="4" fill="#C99A5A" />
          <ellipse cx="-12" cy="0" rx="4" ry="3" fill="#B58040" opacity="0.7" />
          <ellipse cx="-5" cy="4" rx="5" ry="3" fill="#9A6A3A" opacity="0.7" />
          <ellipse cx="6" cy="5" rx="6" ry="3" fill="#8B5A2B" opacity="0.6" />
          <ellipse cx="12" cy="1" rx="4" ry="3" fill="#9A6A3A" opacity="0.7" />

          {/* More detail bumps */}
          <circle cx="-14" cy="-2" r="2.5" fill="#B58040" opacity="0.6" />
          <circle cx="-6" cy="-8" r="2.5" fill="#D4A868" opacity="0.5" />
          <circle cx="6" cy="-8" r="2.5" fill="#D4A868" opacity="0.5" />
          <circle cx="14" cy="-2" r="2.5" fill="#B58040" opacity="0.6" />
          <circle cx="-8" cy="6" r="2" fill="#7A4A20" opacity="0.5" />
          <circle cx="10" cy="6" r="2" fill="#7A4A20" opacity="0.5" />

          {/* Golden highlights */}
          <ellipse cx="-4" cy="-8" rx="7" ry="2.5" fill="#E0B878" opacity="0.5" />
          <ellipse cx="8" cy="-6" rx="5" ry="2" fill="#E8C088" opacity="0.4" />

          {/* Dark crevices */}
          <path d="M -12 2 Q -6 4 0 2" stroke="#6B4020" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M 4 3 Q 10 5 14 3" stroke="#6B4020" strokeWidth="1.5" fill="none" opacity="0.3" />
        </g>
      ),
      wing: (
        <g key={`piece-${index}`} transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}>
          {/* Shadow */}
          <ellipse cx="0" cy="6" rx="12" ry="4" fill="rgba(0,0,0,0.15)" />

          {/* Wing - small piece */}
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#8B5A2B" />
          <ellipse cx="0" cy="-1" rx="11" ry="7" fill="#A0724A" />
          <ellipse cx="0" cy="-2" rx="10" ry="6" fill="#B8864A" />

          {/* Crispy texture */}
          <ellipse cx="-5" cy="-3" rx="4" ry="3" fill="#C99A5A" />
          <ellipse cx="4" cy="-3" rx="5" ry="3" fill="#CDA060" />
          <ellipse cx="-3" cy="2" rx="4" ry="2" fill="#9A6A3A" opacity="0.7" />
          <ellipse cx="5" cy="2" rx="3" ry="2" fill="#8B5A2B" opacity="0.6" />

          {/* Detail bumps */}
          <circle cx="-8" cy="-1" r="2" fill="#B58040" opacity="0.6" />
          <circle cx="0" cy="-5" r="2" fill="#D4A868" opacity="0.5" />
          <circle cx="8" cy="-1" r="2" fill="#B58040" opacity="0.6" />

          {/* Golden highlight */}
          <ellipse cx="0" cy="-4" rx="5" ry="2" fill="#E0B878" opacity="0.5" />

          {/* Bone tips on both sides */}
          <ellipse cx="-11" cy="0" rx="3" ry="2" fill="#F5F0E0" />
          <ellipse cx="11" cy="0" rx="3" ry="2" fill="#F5F0E0" />
        </g>
      ),
    }

    return shapes[pos.type]
  }

  return (
    <>
      <defs>
        <linearGradient id="fc-plate-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        <radialGradient id="honey-fc-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#E6B800" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="86" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />

      {/* Plate */}
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="url(#fc-plate-grad)" />
      <ellipse cx="50" cy="52" rx="42" ry="28" fill="#F8F8F8" />
      <ellipse cx="50" cy="52" rx="46" ry="32" fill="none" stroke="#E0E0E0" strokeWidth="2" />

      {/* Parchment paper liner */}
      <ellipse cx="50" cy="50" rx="38" ry="24" fill="#FFF8E7" opacity="0.6" />
      {/* Paper crinkle */}
      <path d="M 18 50 Q 35 46 50 50 Q 65 54 82 50" stroke="#F5E8D5" strokeWidth="0.5" fill="none" opacity="0.6" />

      {/* Chicken pieces */}
      {piecePositions.map((pos, index) => renderPiece(pos, index))}

      {/* Honey mustard cup */}
      <g transform="translate(16, 72)">
        <ellipse cx="0" cy="5" rx="9" ry="4" fill="#C8C8C8" />
        <rect x="-9" y="0" width="18" height="6" fill="#D8D8D8" />
        <ellipse cx="0" cy="0" rx="9" ry="4" fill="#E0E0E0" />
        <ellipse cx="0" cy="0" rx="7" ry="3" fill="url(#honey-fc-grad)" />
        <ellipse cx="-2" cy="-1" rx="2.5" ry="1.5" fill="#FFF080" opacity="0.4" />
      </g>

      {/* Coleslaw side */}
      {piecesRemaining > 2 && (
        <g transform="translate(84, 58)">
          <ellipse cx="0" cy="0" rx="11" ry="7" fill="#F5F5E8" />
          <ellipse cx="-4" cy="-2" rx="4" ry="2" fill="#90EE90" opacity="0.5" />
          <ellipse cx="3" cy="-1" rx="3" ry="1.5" fill="#FFA500" opacity="0.4" />
          <ellipse cx="-1" cy="2" rx="5" ry="2" fill="#F0EBD8" opacity="0.7" />
          {/* Mayo drizzle */}
          <path d="M -5 0 Q 0 -2 5 0" stroke="#FFFAF0" strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      )}

      {/* Parsley */}
      {piecesRemaining > 2 && (
        <g>
          <circle cx="52" cy="72" r="2.5" fill="#228B22" opacity="0.8" />
          <circle cx="55" cy="70" r="2" fill="#2E8B2E" opacity="0.7" />
          <circle cx="49" cy="70" r="1.5" fill="#228B22" opacity="0.7" />
        </g>
      )}
    </>
  )
}
