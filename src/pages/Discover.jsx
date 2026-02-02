import { useState, useMemo } from 'react'
import { useSpecials } from '../hooks/useSpecials'
import { useLocationContext } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'
import { SpecialCard } from '../components/SpecialCard'
import { TownPicker } from '../components/TownPicker'
import { SuggestRestaurant } from '../components/SuggestRestaurant'
import { SuggestDish } from '../components/SuggestDish'
import { LocationPermissionCard } from '../components/LocationPermissionCard'
import { RadiusFilter } from '../components/RadiusFilter'
import { BeTheFirstCard } from '../components/BeTheFirstCard'

// Sort options for specials
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
]

export function Discover() {
  const { specials, loading, error, refetch } = useSpecials()
  const { town, setTown, isUsingDefault, permissionState } = useLocationContext()
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestRestaurant, setShowSuggestRestaurant] = useState(false)
  const [showSuggestDish, setShowSuggestDish] = useState(false)

  // Filter and sort specials
  const filteredSpecials = useMemo(() => {
    let result = specials || []

    // Filter by town
    if (town) {
      result = result.filter(s => s.restaurants?.town === town)
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result = result.slice().sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_high':
        result = result.slice().sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'newest':
      default:
        // Already sorted by created_at desc from API
        break
    }

    return result
  }, [specials, town, sortBy])

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-surface)' }}>
      <h1 className="sr-only">Discover Specials & Deals</h1>

      {/* Header */}
      <header
        className="px-4 pt-6 pb-4"
        style={{
          background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Discover
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              Specials & deals near you
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Dish button */}
            <button
              onClick={() => setShowSuggestDish(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'var(--color-surface-elevated)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-divider)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Dish
            </button>

            {/* Add Restaurant button */}
            <button
              onClick={() => setShowSuggestRestaurant(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Restaurant
            </button>

            {/* Filter toggle */}
            {specials?.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: showFilters ? 'var(--color-primary-muted)' : 'var(--color-surface-elevated)',
                  color: showFilters ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  border: `1px solid ${showFilters ? 'var(--color-primary)' : 'var(--color-divider)'}`,
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {town && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && specials?.length > 0 && (
          <div
            className="mt-4 p-4 rounded-xl animate-expand-in"
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-divider)',
            }}
          >
            {/* Radius filter */}
            <RadiusFilter className="mb-4" />

            {/* Town filter */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Town
              </label>
              <TownPicker value={town} onChange={setTown} />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Sort by
              </label>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{
                      background: sortBy === option.id ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                      color: sortBy === option.id ? 'white' : 'var(--color-text-secondary)',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(town || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setTown(null)
                  setSortBy('newest')
                }}
                className="mt-4 text-xs font-medium"
                style={{ color: 'var(--color-primary)' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </header>

      {/* Location Permission Card - show when not using actual location */}
      {(isUsingDefault || permissionState === 'denied') && (
        <div className="px-4 pb-4">
          <LocationPermissionCard variant="compact" />
        </div>
      )}

      {/* Active filter pills */}
      {(town || sortBy !== 'newest') && !showFilters && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {town && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              {town}
              <button onClick={() => setTown(null)} className="ml-0.5 hover:opacity-70">×</button>
            </span>
          )}
          {sortBy !== 'newest' && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'var(--color-surface-elevated)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {SORT_OPTIONS.find(o => o.id === sortBy)?.label}
              <button onClick={() => setSortBy('newest')} className="ml-0.5 hover:opacity-70">×</button>
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && specials?.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {filteredSpecials.length === specials.length
              ? `${specials.length} special${specials.length === 1 ? '' : 's'}`
              : `${filteredSpecials.length} of ${specials.length} specials`
            }
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-2">
        {error ? (
          <div className="text-center py-12">
            <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>
              {error?.message || 'Unable to load specials'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl animate-pulse"
                style={{ background: 'var(--color-card)' }}
              />
            ))}
          </div>
        ) : filteredSpecials.length > 0 ? (
          <div className="space-y-3">
            {filteredSpecials.map((special) => (
              <SpecialCard key={special.id} special={special} />
            ))}
          </div>
        ) : specials?.length > 0 && town ? (
          // No specials in selected town
          <div
            className="text-center py-12 rounded-xl"
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-divider)'
            }}
          >
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-surface-elevated)' }}
            >
              <span className="text-2xl">🏘️</span>
            </div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              No specials in {town}
            </h3>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              {specials.length} special{specials.length === 1 ? '' : 's'} available in other towns
            </p>
            <button
              onClick={() => setTown(null)}
              className="px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              View All Towns
            </button>
          </div>
        ) : (
          // No specials at all - show "Be the First" card
          <BeTheFirstCard variant="discover" />
        )}
      </div>

      {/* Suggest Restaurant Modal */}
      {showSuggestRestaurant && (
        user ? (
          <SuggestRestaurant
            onClose={() => setShowSuggestRestaurant(false)}
            onSuccess={() => setShowSuggestRestaurant(false)}
          />
        ) : (
          <LoginPromptModal
            onClose={() => setShowSuggestRestaurant(false)}
            message="Help grow our community by adding your favorite restaurants."
          />
        )
      )}

      {/* Suggest Dish Modal */}
      {showSuggestDish && (
        user ? (
          <SuggestDish
            onClose={() => setShowSuggestDish(false)}
            onSuccess={() => setShowSuggestDish(false)}
          />
        ) : (
          <LoginPromptModal
            onClose={() => setShowSuggestDish(false)}
            message="Help grow our community by adding dishes you love."
          />
        )
      )}
    </div>
  )
}

// Login prompt modal component
function LoginPromptModal({ onClose, message }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-surface-elevated)' }}
        >
          <span className="text-2xl">🔐</span>
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Sign in to contribute
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-medium text-sm"
            style={{
              background: 'var(--color-surface-elevated)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-divider)'
            }}
          >
            Cancel
          </button>
          <a
            href="/login"
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white text-center"
            style={{ background: 'var(--color-primary)' }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
