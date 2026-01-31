import { memo } from 'react'

/**
 * QualityEmptyState - Smart empty state with GPS Quality Control suggestions
 *
 * Shows contextual guidance based on why no quality dishes were found:
 * 1. Town filter active → suggest clearing town filter
 * 2. Low quality dishes only → suggest expanding radius
 * 3. No dishes at all → suggest browsing all
 */
export const QualityEmptyState = memo(function QualityEmptyState({
  dishes = [],
  town,
  radius,
  onClearTown,
  onExpandRadius,
  onBrowseAll,
  minQualityThreshold = 65, // Minimum % would order again
}) {
  // Count dishes that meet quality threshold
  const qualityDishes = dishes.filter(d =>
    (d.total_votes || 0) >= 5 && (d.percent_worth_it || 0) >= minQualityThreshold
  )

  const hasAnyDishes = dishes.length > 0
  const hasQualityDishes = qualityDishes.length > 0
  const riskyDishCount = dishes.filter(d =>
    (d.total_votes || 0) >= 5 && (d.percent_worth_it || 0) < 50
  ).length

  // Case 1: Town filter is active and no dishes
  if (town && !hasAnyDishes) {
    return (
      <div className="py-12 text-center">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-surface-elevated)' }}
        >
          <span className="text-3xl">🏘️</span>
        </div>
        <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
          No dishes in {town}
        </p>
        <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Try viewing all island locations
        </p>
        <button
          onClick={onClearTown}
          className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: 'white' }}
        >
          View All Island
        </button>
      </div>
    )
  }

  // Case 2: Dishes exist but none meet quality threshold
  if (hasAnyDishes && !hasQualityDishes) {
    return (
      <div className="py-10 text-center">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(245, 158, 11, 0.12)' }}
        >
          <span className="text-3xl">📍</span>
        </div>
        <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
          No top-rated dishes nearby
        </p>
        <p className="text-sm mt-1 px-4" style={{ color: 'var(--color-text-secondary)' }}>
          {riskyDishCount > 0 ? (
            <>Found {riskyDishCount} dish{riskyDishCount === 1 ? '' : 'es'} but consensus is low.</>
          ) : (
            <>Dishes in this area need more votes to be ranked.</>
          )}
        </p>

        {/* GPS Quality Control suggestion */}
        <div
          className="mt-4 mx-4 p-4 rounded-xl text-left"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-accent-gold-muted)' }}
            >
              <span className="text-sm">💡</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                Expand your search
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Better options are {radius <= 3 ? '5' : '10'}+ miles away
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {radius <= 5 && (
              <button
                onClick={() => onExpandRadius(10)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                }}
              >
                Search 10 miles
              </button>
            )}
            {radius <= 10 && (
              <button
                onClick={() => onExpandRadius(25)}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-divider)',
                }}
              >
                Search 25 miles
              </button>
            )}
            {town && (
              <button
                onClick={onClearTown}
                className="py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: 'var(--color-accent-gold)',
                }}
              >
                All towns
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Case 3: No dishes at all
  return (
    <div className="py-12 text-center">
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{ background: 'var(--color-surface-elevated)' }}
      >
        <span className="text-3xl">🍽️</span>
      </div>
      <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
        No dishes found
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
        {town ? `Try viewing all island locations` : `Be the first to rate a dish!`}
      </p>
      <div className="flex justify-center gap-3 mt-4">
        {town ? (
          <button
            onClick={onClearTown}
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            View All Island
          </button>
        ) : (
          <button
            onClick={onBrowseAll}
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            Browse Categories
          </button>
        )}
      </div>
    </div>
  )
})

/**
 * NoQualityDishesNotice - Inline notice when quality dishes are limited
 * Use this as a banner/notice above search results
 */
export const NoQualityDishesNotice = memo(function NoQualityDishesNotice({
  qualityCount,
  totalCount,
  onExpandRadius,
  radius,
}) {
  // Don't show if there are quality dishes or not enough data
  if (qualityCount > 0 || totalCount === 0) {
    return null
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl mb-4"
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
      }}
    >
      <span className="text-lg">📍</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Limited quality options nearby
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {totalCount} dish{totalCount === 1 ? '' : 'es'} found, but none highly rated yet
        </p>
      </div>
      {radius < 25 && (
        <button
          onClick={() => onExpandRadius(radius <= 5 ? 10 : 25)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{
            background: 'var(--color-accent-gold-muted)',
            color: 'var(--color-accent-gold)',
          }}
        >
          Expand radius
        </button>
      )}
    </div>
  )
})
