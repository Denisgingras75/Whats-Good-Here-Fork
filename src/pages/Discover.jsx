import { useSpecials } from '../hooks/useSpecials'
import { SpecialCard } from '../components/SpecialCard'

export function Discover() {
  const { specials, loading, error } = useSpecials()

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-surface)' }}>
      <h1 className="sr-only">Discover Specials</h1>

      {/* Header */}
      <header className="px-4 pt-6 pb-4" style={{ background: 'var(--color-bg)' }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Discover
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Specials & deals from island restaurants
        </p>
      </header>

      {/* Content */}
      <div className="px-4 py-4">
        {error ? (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
              {error?.message || 'Unable to load specials'}
            </p>
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
        ) : specials.length > 0 ? (
          <div className="space-y-3">
            {specials.map((special) => (
              <SpecialCard key={special.id} special={special} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-xl"
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-divider)'
            }}
          >
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              No specials yet
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Check back soon for deals from local restaurants
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
