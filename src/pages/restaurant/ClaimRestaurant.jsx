import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { restaurantsApi } from '../../api/restaurantsApi'
import { useRestaurantOwnership, useRestaurantClaims } from '../../hooks/useRestaurantOwnership'
import { logger } from '../../utils/logger'

export function ClaimRestaurant() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [restaurant, setRestaurant] = useState(null)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)

  const { isClaimed, isOwnedByCurrentUser, hasPendingClaim, loading: ownershipLoading } = useRestaurantOwnership(restaurantId)
  const { submitClaim, submitting } = useRestaurantClaims()

  // Form state
  const [businessRole, setBusinessRole] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Fetch restaurant details
  useEffect(() => {
    async function fetchRestaurant() {
      if (!restaurantId) return

      setLoadingRestaurant(true)
      try {
        const data = await restaurantsApi.getById(restaurantId)
        setRestaurant(data)
      } catch (err) {
        logger.error('Error fetching restaurant:', err)
        setError('Restaurant not found')
      }
      setLoadingRestaurant(false)
    }

    fetchRestaurant()
  }, [restaurantId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      navigate('/login', { state: { returnTo: `/restaurant/claim/${restaurantId}` } })
      return
    }

    if (!businessRole.trim()) {
      setError('Please enter your role at this restaurant')
      return
    }

    if (!agreed) {
      setError('Please confirm you are authorized to manage this restaurant')
      return
    }

    const { data, error: submitError } = await submitClaim({
      restaurantId,
      businessRole: businessRole.trim(),
      verificationMethod: 'manual_review',
      verificationNotes: verificationNotes.trim()
    })

    if (submitError) {
      setError(submitError?.message || 'Failed to submit claim')
      return
    }

    setSubmitted(true)
  }

  const loading = loadingRestaurant || ownershipLoading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full" style={{ background: 'var(--color-divider)' }} />
          <p style={{ color: 'var(--color-text-tertiary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Restaurant not found
          </p>
          <Link
            to="/restaurants"
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    )
  }

  // Already owned by this user
  if (isOwnedByCurrentUser) {
    return (
      <div className="min-h-screen p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-md mx-auto pt-8">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34, 197, 94, 0.15)' }}
            >
              <svg className="w-8 h-8" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              You own this restaurant
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {restaurant.name} is already linked to your account.
            </p>
            <Link
              to={`/restaurant/dashboard/${restaurantId}`}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)' }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Already has a pending claim
  if (hasPendingClaim) {
    return (
      <div className="min-h-screen p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-md mx-auto pt-8">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-accent-gold-muted)' }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--color-accent-gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Claim pending review
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Your claim for {restaurant.name} is being reviewed. We'll notify you once it's approved.
            </p>
            <Link
              to="/profile"
              className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)', border: '1px solid var(--color-divider)' }}
            >
              View My Claims
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Restaurant is already claimed by someone else
  if (isClaimed) {
    return (
      <div className="min-h-screen p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-md mx-auto pt-8">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-surface-elevated)' }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Restaurant already claimed
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {restaurant.name} is already managed by another account. If you believe this is an error, please contact support.
            </p>
            <Link
              to={`/restaurants/${restaurantId}`}
              className="inline-block px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)', border: '1px solid var(--color-divider)' }}
            >
              View Restaurant
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Successfully submitted
  if (submitted) {
    return (
      <div className="min-h-screen p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-md mx-auto pt-8">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(34, 197, 94, 0.15)' }}
            >
              <svg className="w-8 h-8" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Claim submitted!
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              We'll review your claim for {restaurant.name} and notify you once it's approved. This typically takes 1-2 business days.
            </p>
            <Link
              to={`/restaurants/${restaurantId}`}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)' }}
            >
              Back to Restaurant
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Claim form
  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <header
        className="px-4 py-4 sticky top-0 z-10"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Claim Restaurant
          </h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Restaurant info card */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
        >
          <h2 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            {restaurant.name}
          </h2>
          {restaurant.address && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {restaurant.address}
            </p>
          )}
          {restaurant.town && (
            <p className="text-xs mt-2" style={{ color: 'var(--color-accent-gold)' }}>
              {restaurant.town}
            </p>
          )}
        </div>

        {/* Claim benefits */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Why claim your restaurant?
          </h3>
          <div className="space-y-2">
            {[
              'Post specials and happy hour deals',
              'See how your dishes rank against competitors',
              'Understand what customers love (and don\'t)',
              'Respond to ratings and build loyalty',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Login prompt if not authenticated */}
        {!user && (
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'rgba(244, 122, 31, 0.1)', border: '1px solid rgba(244, 122, 31, 0.2)' }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              You'll need to sign in to claim this restaurant.
            </p>
            <Link
              to="/login"
              state={{ returnTo: `/restaurant/claim/${restaurantId}` }}
              className="inline-block mt-3 px-4 py-2 rounded-lg font-semibold text-sm text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              Sign in to continue
            </Link>
          </div>
        )}

        {/* Claim form */}
        {user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business role */}
            <div>
              <label
                htmlFor="businessRole"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Your role at this restaurant *
              </label>
              <select
                id="businessRole"
                value={businessRole}
                onChange={(e) => setBusinessRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              >
                <option value="">Select your role...</option>
                <option value="Owner">Owner</option>
                <option value="General Manager">General Manager</option>
                <option value="Manager">Manager</option>
                <option value="Marketing Director">Marketing Director</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Verification notes */}
            <div>
              <label
                htmlFor="verificationNotes"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Additional information (optional)
              </label>
              <textarea
                id="verificationNotes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Anything that might help us verify your claim..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-text-primary)',
                  '--tw-ring-color': 'var(--color-primary)',
                }}
              />
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 rounded"
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                I confirm that I am authorized to manage this restaurant's presence on What's Good Here.
              </span>
            </label>

            {/* Error message */}
            {error && (
              <div
                className="rounded-lg p-3 text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Claims are typically reviewed within 1-2 business days
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
