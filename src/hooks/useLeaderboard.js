import { useState, useEffect, useCallback } from 'react'
import { leaderboardApi } from '../api/leaderboardApi'

/**
 * Hook for managing friends leaderboard data
 * @param {number} limit - Max leaderboard entries (default 10)
 * @returns {Object} Leaderboard state and actions
 */
export function useLeaderboard(limit = 10) {
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [resetCountdown, setResetCountdown] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null)
      const [leaderboardData, countdown] = await Promise.all([
        leaderboardApi.getFriendsLeaderboard(limit),
        leaderboardApi.getWeeklyResetCountdown(),
      ])
      setLeaderboard(leaderboardData.leaderboard)
      setMyRank(leaderboardData.myRank)
      setResetCountdown(countdown)
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  // Countdown timer
  useEffect(() => {
    if (resetCountdown === null || resetCountdown <= 0) return

    const timer = setInterval(() => {
      setResetCountdown(prev => {
        if (prev === null || prev <= 1) {
          // Refetch when reset happens
          fetchLeaderboard()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resetCountdown, fetchLeaderboard])

  // Format countdown for display
  const formatCountdown = useCallback(() => {
    if (resetCountdown === null || resetCountdown <= 0) return null

    const days = Math.floor(resetCountdown / 86400)
    const hours = Math.floor((resetCountdown % 86400) / 3600)
    const minutes = Math.floor((resetCountdown % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }, [resetCountdown])

  return {
    leaderboard,
    myRank,
    resetCountdown,
    formattedCountdown: formatCountdown(),
    loading,
    error,
    refetch: fetchLeaderboard,
  }
}
