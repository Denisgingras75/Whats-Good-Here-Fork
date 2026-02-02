import { useState, useEffect, useCallback, memo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocationContext } from '../context/LocationContext'
import { restaurantSuggestionsApi } from '../api/restaurantSuggestionsApi'
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
 * SuggestRestaurant - Low-friction restaurant suggestion
 * Auto-loads nearby restaurants, one-tap to suggest
 */
export const SuggestRestaurant = memo(function SuggestRestaurant({
  onClose,
  onSuccess,
}) {
  const { user } = useAuth()
  const { location, isUsingDefault } = useLocationContext()

  // Search state
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [searching, setSearching] = useState(false)
  const [loadingNearby, setLoadingNearby] = useState(true)
  const debouncedQuery = useDebounce(query, 400)

  // Submit state
  const [submittingId, setSubmittingId] = useState(null)
  const [error, setError] = useState(null)
  const [successPlace, setSuccessPlace] = useState(null)

  // Fetch nearby restaurants on mount
  useEffect(() => {
    async function fetchNearby() {
      if (!location?.lat || !location?.lng) {
        setLoadingNearby(false)
        return
      }

      try {
        // Use Overpass API to get nearby restaurants (more reliable for nearby search)
        const overpassQuery = `
          [out:json][timeout:10];
          (
            node["amenity"="restaurant"](around:2000,${location.lat},${location.lng});
            node["amenity"="cafe"](around:2000,${location.lat},${location.lng});
            node["amenity"="bar"](around:2000,${location.lat},${location.lng});
            node["amenity"="fast_food"](around:2000,${location.lat},${location.lng});
          );
          out body 15;
        `

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery
        })

        if (!response.ok) throw new Error('Failed to fetch nearby places')

        const data = await response.json()

        // Transform to match our format
        const places = (data.elements || [])
          .filter(el => el.tags?.name)
          .map(el => ({
            place_id: el.id,
            name: el.tags.name,
            lat: el.lat,
            lon: el.lon,
            type: el.tags.amenity,
            address: {
              road: el.tags['addr:street'],
              house_number: el.tags['addr:housenumber'],
              city: el.tags['addr:city'],
              postcode: el.tags['addr:postcode']
            },
            display_name: [
              el.tags.name,
              el.tags['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim() : null,
              el.tags['addr:city']
            ].filter(Boolean).join(', ')
          }))

        setNearbyPlaces(places)
      } catch (err) {
        logger.error('Error fetching nearby places:', err)
        // Fallback: don't show nearby, just let them search
      }
      setLoadingNearby(false)
    }

    fetchNearby()
  }, [location?.lat, location?.lng])

  // Search OpenStreetMap/Nominatim
  const searchOSM = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      let searchUrl = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery + ' restaurant')}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=8`

      if (location?.lat && location?.lng) {
        const latDelta = 0.7
        const lngDelta = 0.9
        searchUrl += `&viewbox=${location.lng - lngDelta},${location.lat + latDelta},${location.lng + lngDelta},${location.lat - latDelta}`
        searchUrl += `&bounded=0`
      }

      const response = await fetch(searchUrl)
      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
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
  }, [location?.lat, location?.lng])

  useEffect(() => {
    searchOSM(debouncedQuery)
  }, [debouncedQuery, searchOSM])

  // One-tap suggest
  const handleQuickSuggest = async (place) => {
    if (!user) {
      setError('Please sign in to suggest a restaurant')
      return
    }

    setSubmittingId(place.place_id)
    setError(null)

    try {
      // Check for duplicates
      const { exists } = await restaurantSuggestionsApi.checkDuplicate(
        String(place.place_id)
      )
      if (exists) {
        setError('This restaurant has already been suggested')
        setSubmittingId(null)
        return
      }

      // Extract town from address
      const addr = place.address || {}
      const townName = addr.city || addr.town || addr.village || addr.suburb || addr.hamlet || ''

      await restaurantSuggestionsApi.submit({
        name: place.name || place.display_name?.split(',')[0] || 'Unknown',
        address: place.display_name || null,
        town: townName || null,
        osmPlaceId: String(place.place_id),
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        notes: null
      })

      setSuccessPlace(place)
      if (onSuccess) onSuccess()
    } catch (err) {
      logger.error('Error submitting suggestion:', err)
      setError(err?.message || 'Failed to submit')
    }
    setSubmittingId(null)
  }

  // Success state
  if (successPlace) {
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
            Thanks!
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            <strong>{successPlace.name}</strong> has been suggested. We'll review it soon.
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

  const displayPlaces = query.length >= 2 ? searchResults : nearbyPlaces
  const isSearching = query.length >= 2

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between flex-shrink-0"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}
        >
          <h3 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Add a Restaurant
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

        {/* Search */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--color-divider)' }}>
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
              placeholder="Search or pick from nearby..."
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
        </div>

        {/* Error */}
        {error && (
          <div
            className="mx-4 mt-3 rounded-lg p-3 text-sm"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loadingNearby && !isSearching ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 mx-auto border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
              <p className="text-sm mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
                Finding nearby restaurants...
              </p>
            </div>
          ) : displayPlaces.length > 0 ? (
            <div>
              <p className="px-4 py-2 text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                {isSearching ? 'Search Results' : 'Nearby - tap to suggest'}
              </p>
              {displayPlaces.map((place, i) => (
                <button
                  key={place.place_id}
                  onClick={() => handleQuickSuggest(place)}
                  disabled={submittingId === place.place_id}
                  className="w-full px-4 py-3 text-left hover:opacity-80 transition-opacity flex items-center gap-3 disabled:opacity-50"
                  style={{
                    background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)',
                    borderBottom: '1px solid var(--color-divider)'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-primary-muted)' }}
                  >
                    <span className="text-lg">
                      {place.type === 'cafe' ? '☕' : place.type === 'bar' ? '🍺' : place.type === 'fast_food' ? '🍔' : '🍽️'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {place.name || place.display_name?.split(',')[0]}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      {place.display_name}
                    </p>
                  </div>
                  {submittingId === place.place_id ? (
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          ) : isSearching && !searching ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                No restaurants found. Try a different search.
              </p>
            </div>
          ) : !isSearching && !loadingNearby ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                {isUsingDefault
                  ? 'Enable location to see nearby restaurants, or search above.'
                  : 'No nearby restaurants found. Try searching above.'
                }
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex-shrink-0 text-center"
          style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-divider)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Powered by OpenStreetMap
          </p>
        </div>
      </div>
    </div>
  )
})
