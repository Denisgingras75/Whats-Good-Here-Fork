import { memo, useMemo } from 'react'
import { getConsensusLabel } from '../../utils/ranking'
import { MIN_VOTES_FOR_RANKING } from '../../constants/app'

/**
 * DishPerformanceList - Show dish performance metrics for restaurant owners
 * Read-only view of how dishes are performing
 */
export const DishPerformanceList = memo(function DishPerformanceList({
  dishes = [],
  loading = false
}) {
  // Sort dishes by performance (votes * rating)
  const sortedDishes = useMemo(() => {
    return dishes.slice().sort((a, b) => {
      // Prioritize dishes with enough votes
      const aRanked = (a.total_votes || 0) >= MIN_VOTES_FOR_RANKING
      const bRanked = (b.total_votes || 0) >= MIN_VOTES_FOR_RANKING

      if (aRanked && !bRanked) return -1
      if (!aRanked && bRanked) return 1

      // Then by percent_worth_it
      const aPct = a.percent_worth_it || 0
      const bPct = b.percent_worth_it || 0

      if (aPct !== bPct) return bPct - aPct

      // Then by votes
      return (b.total_votes || 0) - (a.total_votes || 0)
    })
  }, [dishes])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-pulse"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg" style={{ background: 'var(--color-surface-elevated)' }} />
              <div className="flex-1">
                <div className="h-4 w-32 rounded mb-2" style={{ background: 'var(--color-surface-elevated)' }} />
                <div className="h-3 w-20 rounded" style={{ background: 'var(--color-surface-elevated)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (sortedDishes.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
      >
        <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          No dishes yet
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Dishes will appear here once added
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sortedDishes.map((dish, index) => (
        <DishPerformanceRow key={dish.id || dish.dish_id} dish={dish} rank={index + 1} />
      ))}
    </div>
  )
})

/**
 * Individual dish performance row
 */
const DishPerformanceRow = memo(function DishPerformanceRow({ dish, rank }) {
  const name = dish.name || dish.dish_name
  const votes = dish.total_votes || 0
  const percentWorthIt = dish.percent_worth_it || 0
  const avgRating = dish.avg_rating || 0
  const isRanked = votes >= MIN_VOTES_FOR_RANKING

  const consensus = getConsensusLabel(percentWorthIt, votes)

  // Determine performance tier
  const getTier = () => {
    if (!isRanked) return { label: 'Needs votes', color: 'var(--color-text-tertiary)', bg: 'var(--color-surface-elevated)' }
    if (percentWorthIt >= 80) return { label: 'Certified', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' }
    if (percentWorthIt >= 65) return { label: 'Good', color: 'var(--color-accent-gold)', bg: 'var(--color-accent-gold-muted)' }
    if (percentWorthIt >= 50) return { label: 'Mixed', color: 'var(--color-text-secondary)', bg: 'var(--color-surface-elevated)' }
    return { label: 'At Risk', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
  }

  const tier = getTier()

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
    >
      <div className="flex items-center gap-3">
        {/* Rank badge */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{
            background: rank <= 3 ? 'var(--color-accent-gold-muted)' : 'var(--color-surface-elevated)',
            color: rank <= 3 ? 'var(--color-accent-gold)' : 'var(--color-text-tertiary)'
          }}
        >
          {rank}
        </div>

        {/* Dish info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
            {name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {votes} vote{votes === 1 ? '' : 's'}
            </span>
            {isRanked && (
              <>
                <span style={{ color: 'var(--color-divider)' }}>·</span>
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {percentWorthIt}% would order again
                </span>
              </>
            )}
          </div>
        </div>

        {/* Performance tier badge */}
        <div
          className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
          style={{ background: tier.bg, color: tier.color }}
        >
          {tier.label}
        </div>
      </div>

      {/* Performance bar */}
      {isRanked && (
        <div className="mt-3 flex items-center gap-2">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--color-surface-elevated)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percentWorthIt}%`,
                background: percentWorthIt >= 80 ? '#22c55e' :
                           percentWorthIt >= 65 ? 'var(--color-accent-gold)' :
                           percentWorthIt >= 50 ? 'var(--color-text-tertiary)' : '#ef4444'
              }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right" style={{ color: tier.color }}>
            {percentWorthIt}%
          </span>
        </div>
      )}

      {/* Low vote warning */}
      {!isRanked && votes > 0 && (
        <div
          className="mt-2 flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
          style={{ background: 'var(--color-surface-elevated)' }}
        >
          <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-accent-gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span style={{ color: 'var(--color-text-tertiary)' }}>
            {MIN_VOTES_FOR_RANKING - votes} more vote{MIN_VOTES_FOR_RANKING - votes === 1 ? '' : 's'} needed to rank
          </span>
        </div>
      )}
    </div>
  )
})
