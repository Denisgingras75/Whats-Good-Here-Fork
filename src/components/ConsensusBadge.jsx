import { memo } from 'react'
import { getConsensusLabel } from '../utils/ranking'

/**
 * ConsensusBadge - Shows quality consensus label based on "would order again" %
 *
 * Variants:
 * - 'badge': Compact pill badge (for cards, lists)
 * - 'inline': Inline text with icon (for detail views)
 * - 'full': Full badge with description (for prominent display)
 */
export const ConsensusBadge = memo(function ConsensusBadge({
  percentWorthIt,
  totalVotes,
  variant = 'badge',
  showPercentage = true,
  className = '',
}) {
  const consensus = getConsensusLabel(percentWorthIt, totalVotes)

  // Don't show badge if not enough votes
  if (!consensus.showBadge) {
    return null
  }

  // Compact badge variant (for lists, cards)
  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}
        style={{
          background: consensus.bgColor,
          color: consensus.color,
        }}
      >
        <span aria-hidden="true">{consensus.emoji}</span>
        <span>{consensus.label}</span>
      </span>
    )
  }

  // Inline variant (for rows, compact displays)
  if (variant === 'inline') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${className}`}
        style={{ color: consensus.color }}
      >
        <span aria-hidden="true">{consensus.emoji}</span>
        {showPercentage ? (
          <span>{Math.round(percentWorthIt)}% would order again</span>
        ) : (
          <span>{consensus.label}</span>
        )}
      </span>
    )
  }

  // Full variant (for detail views, prominent display)
  if (variant === 'full') {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${className}`}
        style={{
          background: consensus.bgColor,
          border: `1px solid ${consensus.color}20`,
        }}
      >
        <span className="text-lg" aria-hidden="true">{consensus.emoji}</span>
        <div>
          <div className="font-semibold text-sm" style={{ color: consensus.color }}>
            {consensus.label}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {consensus.description}
          </div>
        </div>
      </div>
    )
  }

  return null
})

/**
 * RiskyWarning - Prominent warning for low-consensus dishes
 */
export const RiskyWarning = memo(function RiskyWarning({ percentWorthIt, totalVotes }) {
  // Only show warning for dishes with enough votes and low consensus
  if (totalVotes < 5 || percentWorthIt >= 50) {
    return null
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
      }}
    >
      <span aria-hidden="true">⚠️</span>
      <span className="font-medium">
        Heads up: Only {Math.round(percentWorthIt)}% would order this again
      </span>
    </div>
  )
})

/**
 * CertifiedBadge - Special badge for 80%+ consensus dishes
 * Use this for prominent "Certified Good Here" display
 */
export const CertifiedBadge = memo(function CertifiedBadge({ totalVotes }) {
  if (totalVotes < 5) {
    return null
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.08) 100%)',
        color: '#16a34a',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 0 8px rgba(22, 163, 74, 0.15)',
      }}
    >
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
      <span>Certified</span>
    </span>
  )
})
