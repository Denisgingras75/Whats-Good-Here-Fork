/**
 * Calculate "% Worth It" rating (reorder percentage)
 * @param {number} yesVotes - Number of "Would order again" votes
 * @param {number} totalVotes - Total number of votes
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentWorthIt(yesVotes, totalVotes) {
  if (totalVotes === 0) return 0
  return Math.round((yesVotes / totalVotes) * 100)
}

/**
 * Calculate Worth-It Score on 1-10 scale (derived from reorder %)
 * @param {number} reorderPercent - Percentage who would reorder (0-100)
 * @returns {number} Score on 1-10 scale
 */
export function calculateWorthItScore10(reorderPercent) {
  return reorderPercent / 10
}

/**
 * Format a score to one decimal place
 * @param {number} score - The score to format
 * @returns {string} Formatted score (e.g., "8.4", "9.0", "7.1")
 */
export function formatScore10(score) {
  if (score === null || score === undefined) return '—'
  return Number(score).toFixed(1)
}

/**
 * Get color for rating based on score
 * @param {number} rating - Rating on 1-10 scale
 * @returns {string} CSS color value
 */
export function getRatingColor(rating) {
  if (rating === null || rating === undefined) return 'var(--color-text-tertiary)'
  const score = Number(rating)
  if (score >= 8.0) return '#16a34a' // green-600 - excellent
  if (score >= 6.0) return '#f59e0b' // amber-500 - good
  return '#ef4444' // red-500 - meh
}

/**
 * Get Worth-It badge based on score and vote count
 * @param {number} worthItScore10 - Worth-It score on 1-10 scale
 * @param {number} totalVotes - Total number of votes
 * @returns {Object} { show: boolean, emoji: string, label: string }
 */
export function getWorthItBadge(worthItScore10, totalVotes) {
  // Not enough votes
  if (totalVotes < 10) {
    return {
      show: false,
      emoji: '📊',
      label: 'Not enough votes yet',
    }
  }

  // Determine emoji and label based on score
  if (worthItScore10 >= 9.5) {
    return { show: true, emoji: '🏆', label: 'The Best' }
  }
  if (worthItScore10 >= 9.0) {
    return { show: true, emoji: '⭐', label: 'Exceptional' }
  }
  if (worthItScore10 >= 8.5) {
    return { show: true, emoji: '🔥', label: 'Great Here' }
  }
  if (worthItScore10 >= 8.0) {
    return { show: true, emoji: '✅', label: 'Good Here' }
  }
  if (worthItScore10 >= 7.0) {
    return { show: true, emoji: '👍', label: 'Decent Here' }
  }
  if (worthItScore10 >= 6.0) {
    return { show: true, emoji: '😐', label: 'Not Bad' }
  }
  if (worthItScore10 >= 5.0) {
    return { show: true, emoji: '🤷', label: 'Iffy' }
  }
  return { show: true, emoji: '❌', label: 'Skip This' }
}

/**
 * Get confidence level based on vote count
 * @param {number} totalVotes - Total number of votes
 * @returns {'none' | 'low' | 'medium' | 'high'}
 */
export function getConfidenceLevel(totalVotes) {
  if (totalVotes === 0) return 'none'
  if (totalVotes < 10) return 'low'
  if (totalVotes < 20) return 'medium'
  return 'high'
}

/**
 * Get confidence indicator text and styling
 * @param {number} totalVotes - Total number of votes
 * @returns {Object} Confidence info object
 */
export function getConfidenceIndicator(totalVotes) {
  const level = getConfidenceLevel(totalVotes)

  const indicators = {
    none: {
      level: 'none',
      text: 'No votes yet — be the first!',
      icon: null,
      color: 'gray',
      className: 'text-neutral-500',
    },
    low: {
      level: 'low',
      text: `Not enough votes yet (${totalVotes} ${totalVotes === 1 ? 'vote' : 'votes'})`,
      icon: '📊',
      color: 'yellow',
      className: 'text-yellow-600 border-yellow-300 bg-yellow-50',
    },
    medium: {
      level: 'medium',
      text: `${totalVotes} votes`,
      icon: null,
      color: 'gray',
      className: 'text-gray-600',
    },
    high: {
      level: 'high',
      text: `${totalVotes} votes`,
      icon: '✓',
      color: 'green',
      className: 'text-green-600 border-green-300 bg-green-50',
    },
  }

  return indicators[level]
}

/**
 * Get consensus label based on "would order again" percentage
 * This is the core quality signal shown to users
 * @param {number} percentWorthIt - Percentage who would order again (0-100)
 * @param {number} totalVotes - Total number of votes
 * @returns {Object} { type, label, emoji, color, bgColor, description }
 */
export function getConsensusLabel(percentWorthIt, totalVotes) {
  // Not enough votes for consensus
  if (totalVotes < 5) {
    return {
      type: 'early',
      label: 'Early',
      emoji: '🆕',
      color: 'var(--color-text-tertiary)',
      bgColor: 'var(--color-surface)',
      description: 'Not enough votes yet',
      showBadge: false,
    }
  }

  const pct = Math.round(percentWorthIt)

  // Certified Good Here - 80%+ consensus
  if (pct >= 80) {
    return {
      type: 'certified',
      label: 'Certified',
      emoji: '✓',
      color: '#16a34a', // green-600
      bgColor: 'rgba(22, 163, 74, 0.12)',
      description: `${pct}% would order again`,
      showBadge: true,
    }
  }

  // Good Here - 65-79% consensus
  if (pct >= 65) {
    return {
      type: 'good',
      label: 'Good Here',
      emoji: '👍',
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary-muted)',
      description: `${pct}% would order again`,
      showBadge: true,
    }
  }

  // Mixed Reviews - 50-64% consensus
  if (pct >= 50) {
    return {
      type: 'mixed',
      label: 'Mixed',
      emoji: '🤷',
      color: '#f59e0b', // amber-500
      bgColor: 'rgba(245, 158, 11, 0.12)',
      description: `${pct}% would order again`,
      showBadge: true,
    }
  }

  // Risky - below 50% consensus
  return {
    type: 'risky',
    label: 'Risky',
    emoji: '⚠️',
    color: '#ef4444', // red-500
    bgColor: 'rgba(239, 68, 68, 0.12)',
    description: `Only ${pct}% would order again`,
    showBadge: true,
  }
}

/**
 * Check if dish should show a quality warning
 * @param {number} percentWorthIt - Percentage who would order again
 * @param {number} totalVotes - Total votes
 * @returns {boolean}
 */
export function shouldShowRiskyWarning(percentWorthIt, totalVotes) {
  return totalVotes >= 5 && percentWorthIt < 50
}

/**
 * Check if dish is "Certified" quality
 * @param {number} percentWorthIt - Percentage who would order again
 * @param {number} totalVotes - Total votes
 * @returns {boolean}
 */
export function isCertifiedDish(percentWorthIt, totalVotes) {
  return totalVotes >= 5 && percentWorthIt >= 80
}
