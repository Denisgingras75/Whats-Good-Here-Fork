import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../api/adminApi'
import { dishSuggestionsApi } from '../api/dishSuggestionsApi'
import { getCategoryEmoji } from '../constants/categories'
import { logger } from '../utils/logger'

export function AdminDishSuggestions() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminCheckDone, setAdminCheckDone] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [message, setMessage] = useState(null)

  // Admin notes modal state
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notesAction, setNotesAction] = useState(null) // 'approve' | 'reject'
  const [notesSuggestionId, setNotesSuggestionId] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')

  // Check admin status
  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      setAdminCheckDone(true)
      return
    }

    async function checkAdmin() {
      const result = await adminApi.isAdmin()
      setIsAdmin(result)
      setAdminCheckDone(true)
    }
    checkAdmin()
  }, [user])

  // Fetch pending suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      const data = await dishSuggestionsApi.getPending()
      setSuggestions(data)
    } catch (error) {
      logger.error('Error fetching dish suggestions:', error)
      setMessage({ type: 'error', text: 'Failed to load suggestions' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchSuggestions()
    }
  }, [isAdmin, fetchSuggestions])

  // Open notes modal for action
  function openNotesModal(action, suggestionId) {
    setNotesAction(action)
    setNotesSuggestionId(suggestionId)
    setAdminNotes('')
    setShowNotesModal(true)
  }

  // Handle approve
  async function handleApprove() {
    if (!notesSuggestionId) return

    setProcessingId(notesSuggestionId)
    setShowNotesModal(false)

    try {
      const newDishId = await dishSuggestionsApi.approve(
        notesSuggestionId,
        adminNotes || null
      )
      setMessage({
        type: 'success',
        text: `Dish approved and created! ID: ${newDishId}`
      })
      fetchSuggestions()
    } catch (error) {
      logger.error('Error approving dish suggestion:', error)
      setMessage({ type: 'error', text: `Failed to approve: ${error?.message || error}` })
    } finally {
      setProcessingId(null)
    }
  }

  // Handle reject
  async function handleReject() {
    if (!notesSuggestionId) return

    setProcessingId(notesSuggestionId)
    setShowNotesModal(false)

    try {
      await dishSuggestionsApi.reject(notesSuggestionId, adminNotes || null)
      setMessage({ type: 'success', text: 'Suggestion rejected' })
      fetchSuggestions()
    } catch (error) {
      logger.error('Error rejecting dish suggestion:', error)
      setMessage({ type: 'error', text: `Failed to reject: ${error?.message || error}` })
    } finally {
      setProcessingId(null)
    }
  }

  // Quick approve without notes
  async function quickApprove(suggestionId) {
    setProcessingId(suggestionId)
    try {
      const newDishId = await dishSuggestionsApi.approve(suggestionId)
      setMessage({
        type: 'success',
        text: `Dish approved and created! ID: ${newDishId}`
      })
      fetchSuggestions()
    } catch (error) {
      logger.error('Error approving dish suggestion:', error)
      setMessage({ type: 'error', text: `Failed to approve: ${error?.message || error}` })
    } finally {
      setProcessingId(null)
    }
  }

  // Show loading while checking auth
  if (authLoading || loading || !adminCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'var(--color-primary)' }} />
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Unauthorized
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-danger) 20%, var(--color-bg))' }}>
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Access Denied
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {!user
              ? "You need to be logged in to access this page."
              : "You don't have permission to access the admin area."
            }
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <header className="px-4 py-4 border-b sticky top-0 z-10" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-divider)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Dish Suggestions
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/suggestions"
              className="text-sm font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)' }}
            >
              Restaurants
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)' }}
            >
              Dishes
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Message */}
        {message && (
          <div
            className="mb-4 p-3 rounded-lg text-sm font-medium"
            style={message.type === 'error'
              ? { background: 'color-mix(in srgb, var(--color-danger) 15%, var(--color-surface-elevated))', color: 'var(--color-danger)' }
              : { background: 'color-mix(in srgb, var(--color-success) 15%, var(--color-surface-elevated))', color: 'var(--color-success)' }
            }
          >
            {message.text}
          </div>
        )}

        {/* Pending count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            {suggestions.length} pending dish suggestion{suggestions.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={fetchSuggestions}
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Refresh
          </button>
        </div>

        {/* Suggestions List */}
        {suggestions.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
          >
            <div
              className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-surface-elevated)' }}
            >
              <svg className="w-7 h-7" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>All caught up!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              No pending dish suggestions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <DishSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                processing={processingId === suggestion.id}
                onQuickApprove={() => quickApprove(suggestion.id)}
                onApproveWithNotes={() => openNotesModal('approve', suggestion.id)}
                onReject={() => openNotesModal('reject', suggestion.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'var(--color-surface)' }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {notesAction === 'approve' ? 'Approve Dish' : 'Reject Suggestion'}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Admin Notes (optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder={notesAction === 'reject' ? "Reason for rejection..." : "Any notes..."}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor: 'var(--color-divider)', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold"
                style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={notesAction === 'approve' ? handleApprove : handleReject}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white"
                style={{
                  background: notesAction === 'approve' ? 'var(--color-success)' : 'var(--color-danger)'
                }}
              >
                {notesAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Individual dish suggestion card
function DishSuggestionCard({ suggestion, processing, onQuickApprove, onApproveWithNotes, onReject }) {
  const {
    name,
    category,
    price,
    description,
    created_at,
    profiles,
    restaurants
  } = suggestion

  const submitterName = profiles?.display_name || 'Anonymous'
  const restaurantName = restaurants?.name || 'Unknown Restaurant'
  const restaurantTown = restaurants?.town
  const categoryEmoji = getCategoryEmoji(category)
  const submittedDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-divider)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryEmoji}</span>
              <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
                {name}
              </h3>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              at {restaurantName}
              {restaurantTown && (
                <span style={{ color: 'var(--color-text-tertiary)' }}> ({restaurantTown})</span>
              )}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-text-tertiary)' }}
              >
                {category}
              </span>
              {price && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}
                >
                  ${price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-2" style={{ background: 'var(--color-surface-elevated)' }}>
        {description && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>
              Description
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {description}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Submitted by {submitterName}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {submittedDate}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex gap-2 border-t" style={{ borderColor: 'var(--color-divider)' }}>
        <button
          onClick={onReject}
          disabled={processing}
          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-danger)' }}
        >
          Reject
        </button>
        <button
          onClick={onApproveWithNotes}
          disabled={processing}
          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ background: 'var(--color-surface-elevated)', color: 'var(--color-success)' }}
        >
          Review
        </button>
        <button
          onClick={onQuickApprove}
          disabled={processing}
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: 'var(--color-success)' }}
        >
          {processing ? '...' : 'Approve'}
        </button>
      </div>
    </div>
  )
}
