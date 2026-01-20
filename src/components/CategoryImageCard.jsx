/**
 * CategoryImageCard - Premium image-based category selector
 *
 * Uses real image assets, not SVGs or icons.
 * Feels editorial and curated, like a food magazine.
 */

// Category image mappings
const CATEGORY_IMAGES = {
  pizza: '/categories/pizza.webp',
  burger: '/categories/burgers.webp',
  taco: '/categories/tacos.webp',
  wings: '/categories/wings.webp',
  sushi: '/categories/sushi.webp',
  breakfast: '/categories/breakfast.webp',
  'lobster roll': '/categories/lobster-rolls.webp',
  seafood: '/categories/seafood.webp',
  chowder: '/categories/chowder.webp',
  pasta: '/categories/pasta.webp',
  steak: '/categories/steak.webp',
  sandwich: '/categories/sandwiches.webp',
  salad: '/categories/salads.webp',
  tendys: '/categories/tendys.webp',
}

export function CategoryImageCard({
  category,
  isActive = false,
  onClick,
}) {
  const imageSrc = CATEGORY_IMAGES[category.id] || null

  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center gap-2
        w-full
        transition-all duration-200
        active:scale-[0.97]
      "
    >
      {/* Image container */}
      <div
        className="
          w-full aspect-square
          rounded-[20px]
          overflow-hidden
          transition-all duration-200
        "
        style={{
          background: '#1A1A1A',
          boxShadow: isActive
            ? '0 0 0 2px var(--color-primary), 0 0 20px rgba(244, 162, 97, 0.3)'
            : 'none',
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={category.label}
            className="w-full h-full object-cover"
            onError={(e) => {
              // On error, hide the broken image and show placeholder
              e.target.style.display = 'none'
            }}
          />
        ) : (
          // Neutral placeholder - no icons, just dark box
          <div className="w-full h-full" style={{ background: '#1A1A1A' }} />
        )}
      </div>

      {/* Label below image */}
      <span
        className="text-xs font-medium"
        style={{
          color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}
      >
        {category.label}
      </span>
    </button>
  )
}

export default CategoryImageCard
