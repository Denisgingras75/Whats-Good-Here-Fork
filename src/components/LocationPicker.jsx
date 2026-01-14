import { useState } from 'react'

const RADIUS_OPTIONS = [1, 5, 10, 20]

export function LocationPicker({ radius, onRadiusChange, location, error }) {
  const [showRadiusSheet, setShowRadiusSheet] = useState(false)

  const handleRadiusSelect = (newRadius) => {
    onRadiusChange(newRadius)
    setShowRadiusSheet(false)
  }

  return (
    <>
      {/* Filter Chips Row */}
      <div className="bg-white border-b px-4 py-3" style={{ borderColor: 'var(--color-divider)' }}>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* Location Chip */}
          {error ? (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border"
              style={{
                background: 'color-mix(in srgb, var(--color-danger) 10%, white)',
                borderColor: 'color-mix(in srgb, var(--color-danger) 30%, transparent)',
                color: 'var(--color-danger)'
              }}
            >
              <span>⚠️</span>
              <span className="truncate max-w-[150px]">{error}</span>
            </div>
          ) : location ? (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-divider)',
                color: 'var(--color-text-primary)'
              }}
            >
              <span>📍</span>
              <span>Martha's Vineyard</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border animate-pulse"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-divider)',
                color: 'var(--color-text-tertiary)'
              }}
            >
              <span>📍</span>
              <span>Finding location...</span>
            </div>
          )}

          {/* Radius Chip */}
          <button
            onClick={() => setShowRadiusSheet(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-all hover:border-neutral-300"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-divider)',
              color: 'var(--color-text-primary)'
            }}
          >
            <span>Within {radius} mi</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Radius Bottom Sheet */}
      {showRadiusSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRadiusSheet(false)}
          />

          {/* Sheet Content */}
          <div
            className="relative w-full max-w-lg rounded-t-3xl animate-slide-up"
            style={{ background: 'var(--color-bg)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--color-divider)' }} />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b" style={{ borderColor: 'var(--color-divider)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Search radius
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                How far should we look for dishes?
              </p>
            </div>

            {/* Radius Options */}
            <div className="p-4 space-y-2">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRadiusSelect(r)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    radius === r ? 'border-transparent' : 'border-transparent hover:border-neutral-200'
                  }`}
                  style={radius === r ? {
                    background: 'color-mix(in srgb, var(--color-primary) 10%, white)',
                    borderColor: 'var(--color-primary)'
                  } : {
                    background: 'var(--color-surface)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: radius === r
                          ? 'var(--color-primary)'
                          : 'var(--color-divider)'
                      }}
                    >
                      <span className={radius === r ? 'text-white' : ''}>
                        {r <= 5 ? '🚶' : r <= 10 ? '🚗' : '🛣️'}
                      </span>
                    </div>
                    <div className="text-left">
                      <p
                        className="font-semibold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        Within {r} {r === 1 ? 'mile' : 'miles'}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {r === 1 ? 'Walking distance' : r === 5 ? 'Quick drive' : r === 10 ? 'Short trip' : 'Anywhere on island'}
                      </p>
                    </div>
                  </div>
                  {radius === r && (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Safe area padding */}
            <div className="h-8" />
          </div>
        </div>
      )}
    </>
  )
}
