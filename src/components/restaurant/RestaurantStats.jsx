import { memo } from 'react'

/**
 * RestaurantStats - Display key metrics for restaurant owners
 */
export const RestaurantStats = memo(function RestaurantStats({
  totalDishes = 0,
  totalVotes = 0,
  avgRating = 0,
  topDishName = null,
  activeSpecials = 0,
  loading = false
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 animate-pulse"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div className="h-3 w-16 rounded mb-2" style={{ background: 'var(--color-surface-elevated)' }} />
            <div className="h-6 w-12 rounded" style={{ background: 'var(--color-surface-elevated)' }} />
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Dishes',
      value: totalDishes,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 12" />
        </svg>
      ),
      color: 'var(--color-text-primary)'
    },
    {
      label: 'Total Votes',
      value: totalVotes,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
      ),
      color: 'var(--color-accent-gold)'
    },
    {
      label: 'Avg Rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : '--',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      color: avgRating >= 7.5 ? '#22c55e' : avgRating >= 6 ? 'var(--color-accent-gold)' : 'var(--color-text-secondary)'
    },
    {
      label: 'Active Specials',
      value: activeSpecials,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      color: 'var(--color-primary)'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <span style={{ color: 'var(--color-text-tertiary)' }}>{stat.icon}</span>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {stat.label}
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}

      {/* Top dish callout */}
      {topDishName && (
        <div
          className="col-span-2 rounded-xl p-4"
          style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                Your Top Dish
              </p>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {topDishName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
