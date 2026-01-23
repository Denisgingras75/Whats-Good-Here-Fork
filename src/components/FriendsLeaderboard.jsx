import { useLeaderboard } from '../hooks/useLeaderboard'
import { StreakBadge } from './StreakBadge'

/**
 * FriendsLeaderboard - Weekly competition among mutual friends
 * Only shows mutual follows (both users follow each other)
 */
export function FriendsLeaderboard() {
  const {
    leaderboard,
    formattedCountdown,
    loading,
    error,
  } = useLeaderboard(10)

  if (loading) {
    return (
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-divider)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-divider)' }}>
          <div className="h-5 w-40 rounded animate-pulse" style={{ background: 'var(--color-surface-elevated)' }} />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--color-surface-elevated)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return null
  }

  // Check if there are any friends on the leaderboard (excluding just the user)
  const hasFriends = leaderboard.some(entry => !entry.isCurrentUser)

  if (!hasFriends) {
    return (
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-divider)' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-divider)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h3 className="font-semibold text-[color:var(--color-text-primary)]">Friends Leaderboard</h3>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="text-3xl mb-2">👥</div>
          <p className="font-medium text-[color:var(--color-text-primary)]">No friends yet!</p>
          <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
            Follow friends to compete on the weekly leaderboard
          </p>
          <p className="text-xs text-[color:var(--color-text-tertiary)] mt-2">
            Both users must follow each other to appear here
          </p>
        </div>
      </div>
    )
  }

  // Get rank emoji
  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return { emoji: '🥇', color: '#F59E0B' }
      case 2: return { emoji: '🥈', color: '#9CA3AF' }
      case 3: return { emoji: '🥉', color: '#CD7F32' }
      default: return { emoji: `${rank}`, color: 'var(--color-text-tertiary)' }
    }
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-divider)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-divider)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold text-[color:var(--color-text-primary)]">Friends Leaderboard</h3>
        </div>
        <span className="text-xs text-[color:var(--color-text-tertiary)]">This Week</span>
      </div>

      {/* Leaderboard entries */}
      <div className="divide-y" style={{ borderColor: 'var(--color-divider)' }}>
        {leaderboard.map((entry) => {
          const rankDisplay = getRankDisplay(entry.rank)
          const isTopThree = entry.rank <= 3

          return (
            <div
              key={entry.userId}
              className={`px-4 py-3 flex items-center gap-3 transition-colors ${
                entry.isCurrentUser ? 'bg-[color:var(--color-primary-muted)]' : ''
              }`}
            >
              {/* Rank */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  isTopThree ? 'text-lg' : 'text-sm'
                }`}
                style={{
                  background: isTopThree ? 'var(--color-surface-elevated)' : 'transparent',
                  color: rankDisplay.color,
                }}
              >
                {rankDisplay.emoji}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${entry.isCurrentUser ? 'text-[color:var(--color-primary)]' : 'text-[color:var(--color-text-primary)]'}`}>
                  {entry.isCurrentUser ? 'You' : entry.displayName}
                </p>
              </div>

              {/* Votes this week */}
              <div className="text-right">
                <p className="font-semibold text-[color:var(--color-text-primary)]">
                  {entry.votesThisWeek}
                </p>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">
                  votes
                </p>
              </div>

              {/* Streak badge */}
              {entry.currentStreak > 0 && (
                <StreakBadge streak={entry.currentStreak} size="sm" />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer with reset countdown */}
      <div className="px-4 py-2 border-t text-center" style={{ background: 'var(--color-surface-elevated)', borderColor: 'var(--color-divider)' }}>
        <p className="text-xs text-[color:var(--color-text-tertiary)]">
          {formattedCountdown ? (
            <>Resets in <span className="font-semibold">{formattedCountdown}</span></>
          ) : (
            'Resets every Monday'
          )}
        </p>
      </div>
    </div>
  )
}
