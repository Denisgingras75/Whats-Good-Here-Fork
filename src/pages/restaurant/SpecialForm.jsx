import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { restaurantsApi } from '../../api/restaurantsApi'
import { restaurantUsersApi } from '../../api/restaurantUsersApi'
import { specialsApi } from '../../api/specialsApi'
import { logger } from '../../utils/logger'

export function SpecialForm() {
  const { restaurantId, specialId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = !!specialId && specialId !== 'new'

  const [restaurant, setRestaurant] = useState(null)
  const [canManage, setCanManage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [dealName, setDealName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (!user || !restaurantId) {
        setLoading(false)
        return
      }

      try {
        // Check access
        const hasAccess = await restaurantUsersApi.canManageRestaurant(restaurantId)
        setCanManage(hasAccess)

        if (!hasAccess) {
          setLoading(false)
          return
        }

        // Load restaurant
        const restaurantData = await restaurantsApi.getById(restaurantId)
        setRestaurant(restaurantData)

        // Load existing special if editing
        if (isEditing) {
          const specialData = await specialsApi.getById(specialId)
          if (specialData) {
            setDealName(specialData.deal_name || '')
            setDescription(specialData.description || '')
            setPrice(specialData.price ? String(specialData.price) : '')
            setExpiresAt(specialData.expires_at ? specialData.expires_at.split('T')[0] : '')
          }
        }
      } catch (err) {
        logger.error('Error loading special form:', err)
        setError('Failed to load data')
      }
      setLoading(false)
    }

    loadData()
  }, [user, restaurantId, specialId, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!dealName.trim()) {
      setError('Please enter a name for this special')
      return
    }

    setSaving(true)

    try {
      const specialData = {
        restaurantId,
        dealName: dealName.trim(),
        description: description.trim() || null,
        price: price ? parseFloat(price) : null,
        expiresAt: expiresAt || null
      }

      if (isEditing) {
        await specialsApi.update(specialId, {
          deal_name: specialData.dealName,
          description: specialData.description,
          price: specialData.price,
          expires_at: specialData.expiresAt
        })
      } else {
        await specialsApi.create(specialData)
      }

      navigate(`/restaurant/dashboard/${restaurantId}`)
    } catch (err) {
      logger.error('Error saving special:', err)
      setError(err?.message || 'Failed to save special')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!isEditing) return

    if (!window.confirm('Are you sure you want to delete this special?')) {
      return
    }

    setSaving(true)
    try {
      await specialsApi.deactivate(specialId)
      navigate(`/restaurant/dashboard/${restaurantId}`)
    } catch (err) {
      logger.error('Error deleting special:', err)
      setError('Failed to delete special')
    }
    setSaving(false)
  }

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

  if (!canManage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Access Denied
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <header
        className="px-4 py-4 sticky top-0 z-10"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/restaurant/dashboard/${restaurantId}`)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--color-accent-gold)' }}>{restaurant?.name}</p>
            <h1 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {isEditing ? 'Edit Special' : 'New Special'}
            </h1>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 max-w-md mx-auto space-y-5">
        {/* Deal name */}
        <div>
          <label
            htmlFor="dealName"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Special name *
          </label>
          <input
            type="text"
            id="dealName"
            value={dealName}
            onChange={(e) => setDealName(e.target.value)}
            placeholder="e.g., Happy Hour 50% Off Apps"
            className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-text-primary)',
              '--tw-ring-color': 'var(--color-primary)',
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell customers about this special..."
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

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Price (optional)
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              $
            </span>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2"
              style={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        {/* Expiration */}
        <div>
          <label
            htmlFor="expiresAt"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Expires on (optional)
          </label>
          <input
            type="date"
            id="expiresAt"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-divider)',
              color: 'var(--color-text-primary)',
              '--tw-ring-color': 'var(--color-primary)',
            }}
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Leave blank for ongoing specials
          </p>
        </div>

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
          disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--color-primary)' }}
        >
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Post Special'}
        </button>

        {/* Delete button for editing */}
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
            style={{ color: '#ef4444' }}
          >
            Delete Special
          </button>
        )}
      </form>
    </div>
  )
}
