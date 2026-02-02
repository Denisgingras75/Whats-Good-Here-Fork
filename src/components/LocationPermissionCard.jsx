import { memo } from 'react'
import { useLocationContext } from '../context/LocationContext'

/**
 * LocationPermissionCard - Prompts users to enable location for better results
 * Shows when location permission hasn't been granted or is using default
 */
export const LocationPermissionCard = memo(function LocationPermissionCard({
  variant = 'default', // 'default' | 'compact' | 'inline'
  className = ''
}) {
  const {
    permissionState,
    isUsingDefault,
    loading,
    requestLocation
  } = useLocationContext()

  // Don't show if location is already granted and working
  if (permissionState === 'granted' && !isUsingDefault) {
    return null
  }

  // Don't show if permission was denied (show different message)
  if (permissionState === 'denied') {
    return (
      <div
        className={`rounded-xl p-4 ${className}`}
        style={{
          background: 'var(--color-surface-elevated)',
          border: '1px solid var(--color-divider)'
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              Location access blocked
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Enable location in your browser settings to find restaurants near you.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={requestLocation}
        disabled={loading}
        className={`w-full rounded-xl p-3 flex items-center gap-3 transition-colors hover:opacity-90 ${className}`}
        style={{
          background: 'var(--color-primary-muted)',
          border: '1px solid var(--color-primary)'
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
            {loading ? 'Getting location...' : 'Use my location'}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Find restaurants near you
          </p>
        </div>
        {!loading && (
          <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={requestLocation}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${className}`}
        style={{
          background: 'var(--color-primary-muted)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)'
        }}
      >
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        )}
        {loading ? 'Locating...' : 'Use my location'}
      </button>
    )
  }

  // Default variant - full card
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface-elevated) 100%)',
        border: '1px solid var(--color-primary)'
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
            Find restaurants near you
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Enable location to discover great food anywhere in the world.
          </p>
          <button
            onClick={requestLocation}
            disabled={loading}
            className="mt-3 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-50"
            style={{ background: 'var(--color-primary)' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Getting location...
              </span>
            ) : (
              'Use my location'
            )}
          </button>
        </div>
      </div>
    </div>
  )
})
