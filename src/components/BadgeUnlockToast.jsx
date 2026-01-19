import { toast } from 'sonner'

/**
 * Show a toast when a badge is unlocked
 * @param {Object} badge - The unlocked badge object
 */
export function showBadgeUnlockToast(badge) {
  if (!badge) return

  toast.success(
    <div className="flex items-center gap-3">
      <div className="text-3xl flex-shrink-0">{badge.icon}</div>
      <div className="min-w-0">
        <p className="font-bold text-neutral-900">Badge Unlocked!</p>
        <p className="font-semibold text-neutral-700">{badge.name}</p>
        {badge.subtitle && (
          <p className="text-sm text-neutral-500 truncate">{badge.subtitle}</p>
        )}
      </div>
    </div>,
    {
      duration: 5000,
      className: 'badge-unlock-toast',
    }
  )
}

/**
 * Show toasts for multiple newly unlocked badges
 * @param {Array} badges - Array of newly unlocked badge objects
 */
export function showBadgeUnlockToasts(badges) {
  if (!badges || badges.length === 0) return

  // Show each badge toast with a small delay between them
  badges.forEach((badge, index) => {
    setTimeout(() => {
      showBadgeUnlockToast(badge)
    }, index * 800) // 800ms delay between toasts
  })
}
