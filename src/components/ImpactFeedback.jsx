import { useEffect, useState } from 'react'

/**
 * Calculate impact message based on before/after vote data
 */
export function getImpactMessage(before, after, beforeRank, afterRank) {
  // Just became ranked (hit 5 votes)
  if (before.total_votes < 5 && after.total_votes >= 5) {
    return {
      message: "This dish is now ranked!",
      emoji: "🎉",
      type: "milestone"
    }
  }

  // Entered top 10
  if (beforeRank > 10 && afterRank <= 10) {
    return {
      message: "Just entered the Top 10!",
      emoji: "🏆",
      type: "milestone"
    }
  }

  // Moved up significantly (3+ spots)
  if (afterRank < beforeRank && beforeRank - afterRank >= 3) {
    return {
      message: `Moved up ${beforeRank - afterRank} spots!`,
      emoji: "🚀",
      type: "movement"
    }
  }

  // Moved up
  if (afterRank < beforeRank) {
    const spots = beforeRank - afterRank
    return {
      message: `Moved up ${spots} spot${spots > 1 ? 's' : ''}!`,
      emoji: "📈",
      type: "movement"
    }
  }

  // Still needs votes to qualify
  if (after.total_votes < 5) {
    const needed = 5 - after.total_votes
    return {
      message: `${needed} more vote${needed > 1 ? 's' : ''} to qualify`,
      emoji: "👍",
      type: "progress"
    }
  }

  // Default for ranked dishes - show percentage
  return {
    message: `Now ${Math.round(after.percent_worth_it)}% Worth It`,
    emoji: "✓",
    type: "update"
  }
}

/**
 * Impact feedback toast shown after voting
 */
export function ImpactFeedback({ impact, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (impact) {
      // Animate in
      requestAnimationFrame(() => setVisible(true))

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300) // Wait for fade out
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [impact, onClose])

  if (!impact) return null

  const bgColor = impact.type === 'milestone'
    ? 'from-emerald-500 to-teal-500'
    : impact.type === 'movement'
    ? 'from-blue-500 to-indigo-500'
    : 'from-amber-500 to-orange-500'

  return (
    <div
      className={`fixed inset-x-4 top-20 z-50 transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`bg-gradient-to-r ${bgColor} rounded-2xl shadow-xl p-4 mx-auto max-w-sm`}>
        <div className="flex items-center gap-3 text-white">
          <span className="text-2xl">{impact.emoji}</span>
          <div>
            <p className="font-semibold">{impact.message}</p>
            <p className="text-sm text-white/80">Your vote made a difference</p>
          </div>
        </div>
      </div>
    </div>
  )
}
