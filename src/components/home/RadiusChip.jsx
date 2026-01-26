/**
 * Compact radius filter chip for the hero section
 * Triggers the RadiusSheet bottom sheet when clicked
 */
export function RadiusChip({ radius, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Search radius: ${radius} miles. Tap to change`}
      className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.97]"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        color: 'var(--color-text-primary)',
        minHeight: '36px',
      }}
    >
      <span>{radius} mi</span>
      <svg
        aria-hidden="true"
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}
