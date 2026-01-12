export function PizzaSVG({ eatenPercent, value }) {
  // Pizza slice path - triangular slice shape
  const slicePath = `
    M 50 10
    L 20 85
    Q 50 95 80 85
    Z
  `

  // Crust arc at the bottom
  const crustPath = `
    M 20 85
    Q 50 95 80 85
  `

  // Calculate bite position - eaten from tip down
  const biteY = 10 + (eatenPercent * 75)

  // Generate realistic jagged bite path with irregular teeth marks
  const generateBitePath = (y) => {
    const progress = (y - 10) / 85
    const halfWidth = 5 + (progress * 30)
    const centerX = 50

    // More irregular, realistic bite pattern
    const teeth = [
      { offset: -0.9, depth: 4 + Math.sin(y * 0.5) * 2 },
      { offset: -0.65, depth: 7 + Math.cos(y * 0.3) * 2 },
      { offset: -0.35, depth: 5 + Math.sin(y * 0.7) * 3 },
      { offset: -0.1, depth: 8 + Math.cos(y * 0.4) * 2 },
      { offset: 0.15, depth: 6 + Math.sin(y * 0.6) * 2 },
      { offset: 0.4, depth: 7 + Math.cos(y * 0.5) * 3 },
      { offset: 0.7, depth: 5 + Math.sin(y * 0.8) * 2 },
    ]

    let path = `M 0 ${y} L ${centerX - halfWidth - 10} ${y}`

    teeth.forEach((tooth, i) => {
      const x = centerX + (tooth.offset * halfWidth)
      const nextX = i < teeth.length - 1 ? centerX + (teeth[i + 1].offset * halfWidth) : centerX + halfWidth
      path += ` Q ${x} ${y + tooth.depth}, ${(x + nextX) / 2} ${y + (i % 2 === 0 ? 2 : -1)}`
    })

    path += ` L ${centerX + halfWidth + 10} ${y} L 100 ${y} L 100 100 L 0 100 Z`
    return path
  }

  // Generate random cheese stretch positions based on eatenPercent
  const cheeseStrings = eatenPercent > 0.05 && eatenPercent < 0.85 ? [
    { x: 45 + Math.sin(eatenPercent * 20) * 5, length: 8 + eatenPercent * 15, wobble: Math.sin(eatenPercent * 30) * 3 },
    { x: 52 + Math.cos(eatenPercent * 15) * 4, length: 5 + eatenPercent * 12, wobble: Math.cos(eatenPercent * 25) * 2 },
    { x: 48 + Math.sin(eatenPercent * 25) * 3, length: 10 + eatenPercent * 8, wobble: Math.sin(eatenPercent * 35) * 4 },
  ] : []

  return (
    <>
      <defs>
        {/* Bite-shaped clip path with curved teeth marks */}
        <clipPath id="pizza-eaten-clip">
          <path d={generateBitePath(biteY)} />
        </clipPath>

        <linearGradient id="cheese-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id="crust-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="sauce-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {/* Shadow under pizza */}
      <ellipse
        cx="50"
        cy="92"
        rx={25 - eatenPercent * 10}
        ry={5 - eatenPercent * 2}
        fill="rgba(0,0,0,0.1)"
        className="transition-all duration-200"
      />

      {/* Main pizza slice with bite clip */}
      <g clipPath="url(#pizza-eaten-clip)">
        {/* Pizza base (cheese) */}
        <path
          d={slicePath}
          fill="url(#cheese-gradient)"
          stroke="#D97706"
          strokeWidth="1"
        />

        {/* Sauce peeking through */}
        <path
          d="M 50 15 L 25 80 Q 50 88 75 80 Z"
          fill="url(#sauce-gradient)"
          opacity="0.3"
        />

        {/* Melted cheese texture */}
        <ellipse cx="45" cy="40" rx="10" ry="4" fill="#FDE68A" opacity="0.5" />
        <ellipse cx="55" cy="55" rx="12" ry="4" fill="#FDE68A" opacity="0.5" />
        <ellipse cx="40" cy="70" rx="8" ry="3" fill="#FDE68A" opacity="0.5" />

        {/* Pepperoni toppings */}
        <g>
          <circle cx="42" cy="35" r="7" fill="#DC2626" />
          <circle cx="42" cy="35" r="5" fill="#B91C1C" />
          <circle cx="42" cy="35" r="2" fill="#991B1B" opacity="0.5" />
        </g>
        <g>
          <circle cx="58" cy="45" r="6" fill="#DC2626" />
          <circle cx="58" cy="45" r="4" fill="#B91C1C" />
          <circle cx="58" cy="45" r="1.5" fill="#991B1B" opacity="0.5" />
        </g>
        <g>
          <circle cx="38" cy="55" r="6" fill="#DC2626" />
          <circle cx="38" cy="55" r="4" fill="#B91C1C" />
          <circle cx="38" cy="55" r="1.5" fill="#991B1B" opacity="0.5" />
        </g>
        <g>
          <circle cx="55" cy="65" r="7" fill="#DC2626" />
          <circle cx="55" cy="65" r="5" fill="#B91C1C" />
          <circle cx="55" cy="65" r="2" fill="#991B1B" opacity="0.5" />
        </g>
        <g>
          <circle cx="35" cy="72" r="5" fill="#DC2626" />
          <circle cx="35" cy="72" r="3.5" fill="#B91C1C" />
          <circle cx="35" cy="72" r="1.5" fill="#991B1B" opacity="0.5" />
        </g>
        <g>
          <circle cx="62" cy="75" r="5" fill="#DC2626" />
          <circle cx="62" cy="75" r="3.5" fill="#B91C1C" />
          <circle cx="62" cy="75" r="1.5" fill="#991B1B" opacity="0.5" />
        </g>

        {/* Cheese bubbles */}
        <circle cx="48" cy="50" r="2" fill="#FEF3C7" opacity="0.7" />
        <circle cx="52" cy="38" r="1.5" fill="#FEF3C7" opacity="0.7" />
        <circle cx="60" cy="58" r="1.5" fill="#FEF3C7" opacity="0.7" />
        <circle cx="45" cy="68" r="2" fill="#FEF3C7" opacity="0.7" />
      </g>

      {/* Crust (fades out as we approach 10) */}
      <path
        d={crustPath}
        fill="none"
        stroke="url(#crust-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity={value >= 10 ? 0 : eatenPercent < 0.85 ? 1 : 1 - ((eatenPercent - 0.85) * 6.67)}
        className="transition-opacity duration-200"
      />

      {/* Crust detail - inner edge */}
      <path
        d="M 23 83 Q 50 91 77 83"
        fill="none"
        stroke="#B45309"
        strokeWidth="2"
        opacity={value >= 10 ? 0 : eatenPercent < 0.85 ? 0.5 : 0}
      />

      {/* Bite edge details - exposed cheese, sauce, and stretchy cheese */}
      {eatenPercent > 0.05 && eatenPercent < 0.9 && (
        <g>
          {/* Multiple stretchy cheese strings pulling from bite */}
          {cheeseStrings.map((cheese, i) => (
            <g key={i}>
              {/* Main cheese string */}
              <path
                d={`M ${cheese.x} ${biteY + 2}
                   Q ${cheese.x + cheese.wobble} ${biteY + cheese.length * 0.4}
                     ${cheese.x - cheese.wobble * 0.5} ${biteY + cheese.length * 0.7}
                   Q ${cheese.x + cheese.wobble * 0.3} ${biteY + cheese.length * 0.9}
                     ${cheese.x + cheese.wobble} ${biteY + cheese.length}`}
                fill="none"
                stroke="#FCD34D"
                strokeWidth={2.5 - i * 0.5}
                strokeLinecap="round"
                opacity={0.9 - i * 0.1}
              />
              {/* Cheese string highlight */}
              <path
                d={`M ${cheese.x + 0.5} ${biteY + 3}
                   Q ${cheese.x + cheese.wobble + 0.5} ${biteY + cheese.length * 0.5}
                     ${cheese.x + cheese.wobble} ${biteY + cheese.length * 0.8}`}
                fill="none"
                stroke="#FEF3C7"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.5}
              />
              {/* Drip at end of cheese string */}
              <ellipse
                cx={cheese.x + cheese.wobble}
                cy={biteY + cheese.length + 2}
                rx={1.5 - i * 0.3}
                ry={2 - i * 0.3}
                fill="#FCD34D"
                opacity={0.8}
              />
            </g>
          ))}

          {/* Sauce layer visible at bite edge */}
          <path
            d={`M ${42} ${biteY + 2} Q ${46} ${biteY + 5} ${50} ${biteY + 3} Q ${54} ${biteY + 6} ${58} ${biteY + 2}`}
            fill="#DC2626"
            opacity="0.7"
          />

          {/* Exposed cheese layer bubbling at edge */}
          <ellipse cx="46" cy={biteY + 3} rx="4" ry="2" fill="#FDE68A" opacity="0.8" />
          <ellipse cx="54" cy={biteY + 4} rx="3" ry="1.5" fill="#FDE68A" opacity="0.7" />

          {/* Grease spots on remaining pizza */}
          <circle cx="45" cy={biteY + 15} r="2" fill="#F97316" opacity="0.15" />
          <circle cx="55" cy={biteY + 20} r="2.5" fill="#F97316" opacity="0.12" />
          <circle cx="40" cy={biteY + 30} r="1.8" fill="#F97316" opacity="0.1" />
        </g>
      )}

      {/* Grease drips from pizza */}
      {eatenPercent > 0.1 && eatenPercent < 0.7 && (
        <g opacity="0.4">
          <path
            d={`M 35 ${75 - eatenPercent * 20} Q 34 ${80 - eatenPercent * 15} 35 ${85 - eatenPercent * 10}`}
            fill="none"
            stroke="#F97316"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse cx="35" cy={87 - eatenPercent * 10} rx="2" ry="1" fill="#F97316" />
        </g>
      )}
    </>
  )
}
