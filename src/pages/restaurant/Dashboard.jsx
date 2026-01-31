import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { restaurantsApi } from '../../api/restaurantsApi'
import { restaurantUsersApi } from '../../api/restaurantUsersApi'
import { specialsApi } from '../../api/specialsApi'
import { useRestaurantStats } from '../../hooks/useRestaurantStats'
import { RestaurantStats, DishPerformanceList } from '../../components/restaurant'
import { logger } from '../../utils/logger'

export function RestaurantDashboard() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [restaurant, setRestaurant] = useState(null)
  const [canManage, setCanManage] = useState(false)
  const [specials, setSpecials] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch restaurant stats and dish performance data
  const { stats, dishes: dishPerformance, loading: statsLoading } = useRestaurantStats(
    canManage ? restaurantId : null
  )

  useEffect(() => {
    async function loadDashboard() {
      if (!user || !restaurantId) {
        setLoading(false)
        return
      }

      try {
        // Check if user can manage this restaurant
        const hasAccess = await restaurantUsersApi.canManageRestaurant(restaurantId)
        setCanManage(hasAccess)

        if (!hasAccess) {
          setLoading(false)
          return
        }

        // Load restaurant and specials
        const [restaurantData, specialsData] = await Promise.all([
          restaurantsApi.getById(restaurantId),
          specialsApi.getByRestaurant(restaurantId)
        ])

        setRestaurant(restaurantData)
        setSpecials(specialsData)
      } catch (err) {
        logger.error('Error loading dashboard:', err)
      }
      setLoading(false)
    }

    loadDashboard()
  }, [user, restaurantId])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Sign in to access your restaurant dashboard
          </p>
          <Link
            to="/login"
            state={{ returnTo: `/restaurant/dashboard/${restaurantId}` }}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full" style={{ background: 'var(--color-divider)' }} />
          <p style={{ color: 'var(--color-text-tertiary)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surface-elevated)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Access Denied
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            You don't have permission to manage this restaurant.
          </p>
          <Link
            to="/restaurants"
            className="inline-block px-6 py-3 rounded-xl font-semibold"
            style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)', border: '1px solid var(--color-divider)' }}
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <header
        className="px-4 py-4 sticky top-0 z-10"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/restaurants')}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-accent-gold)' }}>Dashboard</p>
              <h1 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {restaurant?.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Restaurant Stats */}
        <section>
          <h2 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Performance Overview</h2>
          <RestaurantStats
            totalDishes={stats.totalDishes}
            totalVotes={stats.totalVotes}
            avgRating={stats.avgRating}
            topDishName={stats.topDishName}
            activeSpecials={specials.length}
            loading={statsLoading}
          />
        </section>

        {/* Specials section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Your Specials</h2>
            <Link
              to={`/restaurant/specials/${restaurantId}/new`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Special
            </Link>
          </div>

          {specials.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
            >
              <div
                className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-surface-elevated)' }}
              >
                <svg className="w-7 h-7" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>No specials yet</p>
              <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                Post a special to attract customers
              </p>
              <Link
                to={`/restaurant/specials/${restaurantId}/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: 'var(--color-primary)', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Your First Special
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {specials.map(special => (
                <div
                  key={special.id}
                  className="rounded-xl p-4"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {special.deal_name}
                      </h3>
                      {special.description && (
                        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          {special.description}
                        </p>
                      )}
                      {special.price && (
                        <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-accent-gold)' }}>
                          ${special.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/restaurant/specials/${restaurantId}/${special.id}`}
                      className="text-sm font-medium px-3 py-1 rounded-lg"
                      style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dish Performance */}
        <section>
          <h2 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Dish Performance</h2>
          <DishPerformanceList
            dishes={dishPerformance}
            loading={statsLoading}
          />
        </section>

        {/* Coming soon features */}
        <section>
          <h2 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Coming Soon</h2>
          <div className="space-y-3">
            {[
              { icon: '💬', title: 'Review Responses', desc: 'Respond to customer feedback' },
              { icon: '🎵', title: 'Events & Music', desc: 'Post live music and events' },
              { icon: '📈', title: 'Analytics', desc: 'Track views, favorites, and engagement' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)', opacity: 0.6 }}
              >
                <span className="text-xl">{feature.icon}</span>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{feature.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
