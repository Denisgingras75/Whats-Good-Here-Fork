import { memo } from 'react'
import { useLocationContext } from '../context/LocationContext'

// Available radius options in miles
const RADIUS_OPTIONS = [
  { value: 1, label: '1 mi' },
  { value: 5, label: '5 mi' },
  { value: 10, label: '10 mi' },
  { value: 25, label: '25 mi' },
  { value: 50, label: '50 mi' },
]

/**
 * RadiusFilter - Pill buttons for selecting search radius
 * Persists to localStorage via LocationContext
 */
export const RadiusFilter = memo(function RadiusFilter({
  className = '',
  variant = 'default', // 'default' | 'compact'
}) {
  const { radius, setRadius, permissionState, isUsingDefault } = useLocationContext()

  // Show a note when using default location
  const showLocationNote = isUsingDefault && permissionState !== 'granted'

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-xs font-medium mr-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Within:
        </span>
        {RADIUS_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => setRadius(option.value)}
            className="px-2 py-1 rounded-full text-[11px] font-medium transition-colors"
            style={{
              background: radius === option.value ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
              color: radius === option.value ? 'white' : 'var(--color-text-tertiary)',
              border: `1px solid ${radius === option.value ? 'var(--color-primary)' : 'var(--color-divider)'}`
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
          Search Radius
        </label>
        {showLocationNote && (
          <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
            Using default location
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {RADIUS_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => setRadius(option.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: radius === option.value ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
              color: radius === option.value ? 'white' : 'var(--color-text-secondary)',
              border: `1px solid ${radius === option.value ? 'var(--color-primary)' : 'var(--color-divider)'}`
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
})

/**
 * RadiusDisplay - Inline display of current radius with change option
 */
export const RadiusDisplay = memo(function RadiusDisplay({ className = '' }) {
  const { radius, isUsingDefault } = useLocationContext()

  return (
    <span className={`text-xs ${className}`} style={{ color: 'var(--color-text-tertiary)' }}>
      {isUsingDefault ? (
        'Default location'
      ) : (
        `Within ${radius} mi of you`
      )}
    </span>
  )
})
