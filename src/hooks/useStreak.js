import { useState, useEffect, useCallback } from 'react'
import { leaderboardApi } from '../api/leaderboardApi'
import { logger } from '../utils/logger'

/**
 * Hook for managing user streak data
 * @param {string} userId - Optional user ID (defaults to current user)
 * @returns {Object} Streak state and actions
 */
export function useStreak(userId = null) {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    votesThisWeek: 0,
    lastVoteDate: null,
    status: 'none', // 'active' | 'at_risk' | 'broken' | 'none'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch streak data
  const fetchStreak = useCallback(async () => {
    try {
      setError(null)
      const data = userId
        ? await leaderboardApi.getUserStreak(userId)
        : await leaderboardApi.getMyStreak()
      setStreak(data)
    } catch (err) {
      logger.error('Error fetching streak:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Initial fetch
  useEffect(() => {
    fetchStreak()
  }, [fetchStreak])

  // Refresh function for after voting
  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchStreak()
  }, [fetchStreak])

  return {
    ...streak,
    loading,
    error,
    refresh,
  }
}
