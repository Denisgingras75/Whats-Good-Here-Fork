import { memo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { SuggestDish } from './SuggestDish'

/**
 * BeTheFirstCard - Encourages users to be the first to add content
 * Used as an empty state when no dishes exist at a restaurant or in an area
 */
export const BeTheFirstCard = memo(function BeTheFirstCard({
  restaurantId = null,
  restaurantName = '',
  variant = 'restaurant', // 'restaurant' | 'area' | 'discover'
  className = ''
}) {
  const { user } = useAuth()
  const [showSuggestDish, setShowSuggestDish] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleAddDish = () => {
    if (user) {
      setShowSuggestDish(true)
    } else {
      setShowLoginPrompt(true)
    }
  }

  // Restaurant variant - no dishes at a specific restaurant
  if (variant === 'restaurant') {
    return (
      <>
        <div
          className={`rounded-xl p-6 text-center ${className}`}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface) 100%)',
            border: '1px solid var(--color-primary)'
          }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-primary)' }}
          >
            <span className="text-2xl">🌟</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Be the first!
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {restaurantName ? (
              <>No dishes at <strong>{restaurantName}</strong> yet. Add your favorite dish!</>
            ) : (
              'No dishes at this restaurant yet. Add your favorite dish!'
            )}
          </p>
          <button
            onClick={handleAddDish}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Add a Dish
          </button>
        </div>

        {/* Suggest Dish Modal */}
        {showSuggestDish && (
          <SuggestDish
            onClose={() => setShowSuggestDish(false)}
            onSuccess={() => setShowSuggestDish(false)}
            initialRestaurantId={restaurantId}
            initialRestaurantName={restaurantName}
          />
        )}

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <LoginPromptModal
            onClose={() => setShowLoginPrompt(false)}
            message="Sign in to add the first dish at this restaurant!"
          />
        )}
      </>
    )
  }

  // Area variant - no results in radius
  if (variant === 'area') {
    return (
      <>
        <div
          className={`rounded-xl p-6 text-center ${className}`}
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-divider)'
          }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surface-elevated)' }}
          >
            <span className="text-2xl">📍</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Nothing nearby yet
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Be the first to put your favorite spot on the map in this area!
          </p>
          <button
            onClick={handleAddDish}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Add a Restaurant
          </button>
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <LoginPromptModal
            onClose={() => setShowLoginPrompt(false)}
            message="Sign in to add a restaurant to your area!"
          />
        )}
      </>
    )
  }

  // Discover variant - empty state for discover page
  return (
    <>
      <div
        className={`rounded-xl p-8 text-center ${className}`}
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-divider)'
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-primary-muted)' }}
        >
          <span className="text-3xl">🗺️</span>
        </div>
        <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Help build the map
        </h3>
        <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          No dishes in your area yet. Be a pioneer and add your favorite restaurants and dishes!
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handleAddDish}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Add a Dish
          </button>
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Your contributions help others discover great food
        </p>
      </div>

      {/* Suggest Dish Modal */}
      {showSuggestDish && (
        <SuggestDish
          onClose={() => setShowSuggestDish(false)}
          onSuccess={() => setShowSuggestDish(false)}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          message="Sign in to add dishes and help build the community!"
        />
      )}
    </>
  )
})

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
