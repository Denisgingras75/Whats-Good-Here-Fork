import { useState, useEffect, useCallback, memo } from 'react'
import { useAuth } from '../context/AuthContext'
import { restaurantSuggestionsApi } from '../api/restaurantSuggestionsApi'
import { logger } from '../utils/logger'

// MV towns for the dropdown
const MV_TOWNS = [
  'Aquinnah',
  'Chilmark',
  'Edgartown',
  'Menemsha',
  'Oak Bluffs',
  'Vineyard Haven',
  'West Tisbury'
]

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
 * SuggestRestaurant - Component for suggesting missing restaurants
 * Uses OpenStreetMap/Nominatim for free geocoding
 */
export const SuggestRestaurant = memo(function SuggestRestaurant({
  onClose,
  onSuccess,
  initialQuery = ''
}) {
  const { user } = useAuth()

  // Search state
  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 400)

  // Form state
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [manualMode, setManualMode] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [town, setTown] = useState('')
  const [notes, setNotes] = useState('')

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Search OpenStreetMap/Nominatim
  const searchOSM = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // Search for restaurants/cafes/bars near Martha's Vineyard
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery + ' restaurant Martha\'s Vineyard MA')}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `countrycodes=us`
      )

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()

      // Filter to keep only relevant results
      const filtered = data.filter(place =>
        place.type === 'restaurant' ||
        place.type === 'cafe' ||
        place.type === 'bar' ||
        place.type === 'fast_food' ||
        place.class === 'amenity'
      )

      setSearchResults(filtered)
    } catch (err) {
      logger.error('OSM search error:', err)
      setSearchResults([])
    }
    setSearching(false)
  }, [])

  // Trigger search on debounced query change
  useEffect(() => {
    searchOSM(debouncedQuery)
  }, [debouncedQuery, searchOSM])

  // Handle selecting a search result
  const handleSelectPlace = (place) => {
    setSelectedPlace(place)
    setName(place.name || place.display_name.split(',')[0])
    setAddress(place.display_name)

    // Try to extract town from address
    const addressParts = place.display_name.split(',')
    const mvTown = MV_TOWNS.find(t =>
      addressParts.some(part => part.trim().toLowerCase().includes(t.toLowerCase()))
    )
    if (mvTown) setTown(mvTown)

    setSearchResults([])
    setQuery('')
  }

  // Handle manual entry
  const handleManualEntry = () => {
    setManualMode(true)
    setName(query)
    setSearchResults([])
  }

  // Submit suggestion
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter a restaurant name')
      return
    }

    if (!user) {
      setError('Please sign in to suggest a restaurant')
      return
    }

    setSubmitting(true)

    try {
      // Check for duplicates if we have an OSM ID
      if (selectedPlace?.place_id) {
        const { exists } = await restaurantSuggestionsApi.checkDuplicate(
          String(selectedPlace.place_id)
        )
        if (exists) {
          setError('This restaurant has already been suggested')
          setSubmitting(false)
          return
        }
      }

      await restaurantSuggestionsApi.submit({
        name: name.trim(),
        address: address.trim() || null,
        town: town || null,
        osmPlaceId: selectedPlace?.place_id ? String(selectedPlace.place_id) : null,
        lat: selectedPlace?.lat ? parseFloat(selectedPlace.lat) : null,
        lng: selectedPlace?.lon ? parseFloat(selectedPlace.lon) : null,
        notes: notes.trim() || null
      })

      setSuccess(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      logger.error('Error submitting suggestion:', err)
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
          We'll review <strong>{name}</strong> and add it to the app soon.
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
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
      >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}
      >
        <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Suggest a Restaurant
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
        {/* Search or Manual Mode */}
        {!selectedPlace && !manualMode ? (
          <div className="space-y-3">
            {/* Search input */}
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                </div>
              )}
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--color-divider)' }}
              >
                {searchResults.map((place, i) => (
                  <button
                    key={place.place_id}
                    onClick={() => handleSelectPlace(place)}
                    className="w-full px-4 py-3 text-left hover:opacity-80 transition-opacity"
                    style={{
                      background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-elevated)',
                      borderBottom: i < searchResults.length - 1 ? '1px solid var(--color-divider)' : 'none'
                    }}
                  >
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {place.name || place.display_name.split(',')[0]}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      {place.display_name}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Manual entry option */}
            {query.length >= 3 && !searching && (
              <button
                onClick={handleManualEntry}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--color-divider)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Can't find it? Add manually
              </button>
            )}

            <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Powered by OpenStreetMap
            </p>
          </div>
        ) : (
          /* Form mode */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Restaurant Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., The Black Dog Tavern"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)'
                }}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Vineyard Haven"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)'
                }}
              />
            </div>

            {/* Town */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Town
              </label>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)'
                }}
              >
                <option value="">Select town...</option>
                {MV_TOWNS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any details that might help us find it..."
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPlace(null)
                  setManualMode(false)
                  setName('')
                  setAddress('')
                  setTown('')
                }}
                className="flex-1 py-2.5 rounded-xl font-medium text-sm"
                style={{
                  background: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-divider)'
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting || !name.trim()}
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
