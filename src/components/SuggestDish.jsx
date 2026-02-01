import { useState, useEffect, useCallback, memo } from 'react'
import { useAuth } from '../context/AuthContext'
import { restaurantsApi } from '../api/restaurantsApi'
import { dishSuggestionsApi } from '../api/dishSuggestionsApi'
import { MAIN_CATEGORIES } from '../constants/categories'
import { logger } from '../utils/logger'

// Debounce helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * SuggestDish - Component for suggesting dishes at restaurants
 */
export const SuggestDish = memo(function SuggestDish({
  onClose,
  onSuccess,
  initialRestaurantId = null,
  initialRestaurantName = ''
}) {
  const { user } = useAuth()

  // Restaurant search state
  const [restaurantQuery, setRestaurantQuery] = useState('')
  const [restaurantResults, setRestaurantResults] = useState([])
  const [searchingRestaurants, setSearchingRestaurants] = useState(false)
  const debouncedRestaurantQuery = useDebounce(restaurantQuery, 300)

  // Selected restaurant
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    initialRestaurantId ? { id: initialRestaurantId, name: initialRestaurantName } : null
  )

  // Dish form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Search restaurants
  const searchRestaurants = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setRestaurantResults([])
      return
    }

    setSearchingRestaurants(true)
    try {
      const results = await restaurantsApi.search(query, 8)
      setRestaurantResults(results)
    } catch (err) {
      logger.error('Restaurant search error:', err)
      setRestaurantResults([])
    }
    setSearchingRestaurants(false)
  }, [])

  // Trigger restaurant search on debounced query change
  useEffect(() => {
    searchRestaurants(debouncedRestaurantQuery)
  }, [debouncedRestaurantQuery, searchRestaurants])

  // Handle selecting a restaurant
  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setRestaurantQuery('')
    setRestaurantResults([])
  }

  // Submit suggestion
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!selectedRestaurant) {
      setError('Please select a restaurant')
      return
    }

    if (!name.trim()) {
      setError('Please enter a dish name')
      return
    }

    if (!category) {
      setError('Please select a category')
      return
    }

    if (!user) {
      setError('Please sign in to suggest a dish')
      return
    }

    setSubmitting(true)

    try {
      // Check for duplicates
      const { exists } = await dishSuggestionsApi.checkDuplicate(
        selectedRestaurant.id,
        name.trim()
      )
      if (exists) {
        setError('This dish has already been added or suggested at this restaurant')
        setSubmitting(false)
        return
      }

      await dishSuggestionsApi.submit({
        restaurantId: selectedRestaurant.id,
        name: name.trim(),
        category,
        price: price ? parseFloat(price) : null,
        description: description.trim() || null
      })

      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      logger.error('Error submitting dish suggestion:', err)
      setError(err?.message || 'Failed to submit suggestion')
    }

    setSubmitting(false)
  }

  // Success state
  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 text-center"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
        >
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34, 197, 94, 0.15)' }}
          >
            <svg className="w-7 h-7" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Thanks for the suggestion!
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            We'll review <strong>{name}</strong> at <strong>{selectedRestaurant?.name}</strong> and add it soon.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}
        >
          <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Suggest a Dish
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-tertiary)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* Step 1: Select Restaurant */}
          {!selectedRestaurant ? (
            <div className="space-y-3">
              <label className="block text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                Step 1: Choose the restaurant
              </label>

              {/* Restaurant search input */}
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  value={restaurantQuery}
                  onChange={(e) => setRestaurantQuery(e.target.value)}
                  placeholder="Search for a restaurant..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-text-primary)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                />
                {searchingRestaurants && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                  </div>
                )}
              </div>

              {/* Restaurant results */}
              {restaurantResults.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--color-divider)' }}
                >
                  {restaurantResults.map((restaurant, i) => (
                    <button
                      key={restaurant.id}
                      onClick={() => handleSelectRestaurant(restaurant)}
                      className="w-full px-4 py-3 text-left hover:opacity-80 transition-opacity"
                      style={{
                        background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-elevated)',
                        borderBottom: i < restaurantResults.length - 1 ? '1px solid var(--color-divider)' : 'none'
                      }}
                    >
                      <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        {restaurant.name}
                      </p>
                      {restaurant.address && (
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                          {restaurant.address}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {restaurantQuery.length >= 2 && !searchingRestaurants && restaurantResults.length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>
                  No restaurants found. Try a different search.
                </p>
              )}
            </div>
          ) : (
            /* Step 2: Dish Details Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected restaurant display */}
              <div
                className="p-3 rounded-xl flex items-center justify-between"
                style={{ background: 'var(--color-surface-elevated)' }}
              >
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Restaurant
                  </p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedRestaurant.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Change
                </button>
              </div>

              {/* Dish Name */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Lobster Roll, Margherita Pizza"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-text-primary)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Category *
                </label>
                <div className="flex flex-wrap gap-2">
                  {MAIN_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
                      style={{
                        background: category === cat.id ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                        color: category === cat.id ? 'white' : 'var(--color-text-secondary)',
                        border: `1px solid ${category === cat.id ? 'var(--color-primary)' : 'var(--color-divider)'}`
                      }}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price (optional) */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Price (optional)
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{
                      background: 'var(--color-surface-elevated)',
                      border: '1px solid var(--color-divider)',
                      color: 'var(--color-text-primary)',
                      '--tw-ring-color': 'var(--color-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Description (optional) */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any details about this dish..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{
                    background: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-divider)',
                    color: 'var(--color-text-primary)',
                    '--tw-ring-color': 'var(--color-primary)'
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                >
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
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
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !category}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {!user && (
                <p className="text-xs text-center" style={{ color: 'var(--color-accent-gold)' }}>
                  You'll need to sign in to submit
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
})
