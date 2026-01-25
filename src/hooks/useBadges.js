import { useState, useEffect, useCallback } from 'react'
import { badgesApi } from '../api/badgesApi'
import { logger } from '../utils/logger'

export function useBadges(userId) {
  const [badges, setBadges] = useState([])
  const [allBadges, setAllBadges] = useState([])
  const [stats, setStats] = useState({ rated_dishes_count: 0, restaurants_rated_count: 0 })
  const [loading, setLoading] = useState(true)

  // Fetch user's badges and stats
  useEffect(() => {
    if (!userId) {
      setBadges([])
      setStats({ rated_dishes_count: 0, restaurants_rated_count: 0 })
      setLoading(false)
      return
    }

    async function fetchBadges() {
      setLoading(true)
      try {
        const [userBadges, badgeDefs, userStats] = await Promise.all([
          badgesApi.getUserBadges(userId),
          badgesApi.getAllBadges(),
          badgesApi.getUserBadgeStats(userId),
        ])
        setBadges(userBadges)
        setAllBadges(badgeDefs)
        setStats(userStats)
      } catch (error) {
        logger.error('Error fetching badges:', error)
        setBadges([])
        setAllBadges([])
      }
      setLoading(false)
    }

    fetchBadges()
  }, [userId])

  // Refresh badges (call after a vote is submitted)
  const refreshBadges = useCallback(async () => {
    if (!userId) return

    try {
      const [userBadges, userStats] = await Promise.all([
        badgesApi.getUserBadges(userId),
        badgesApi.getUserBadgeStats(userId),
      ])
      setBadges(userBadges)
      setStats(userStats)
    } catch (error) {
      logger.error('Error refreshing badges:', error)
    }
  }, [userId])

  // Evaluate badges and return newly unlocked ones
  const evaluateBadges = useCallback(async () => {
    if (!userId) return []

    try {
      const newlyUnlocked = await badgesApi.evaluateBadges(userId)

      // Refresh badges if any were unlocked
      if (newlyUnlocked.length > 0) {
        await refreshBadges()
      }

      return newlyUnlocked
    } catch (error) {
      logger.error('Error evaluating badges:', error)
      return []
    }
  }, [userId, refreshBadges])

  // Compute progress for each badge
  const badgesWithProgress = allBadges.map(badge => {
    const unlocked = badges.find(b => b.badge_key === badge.key)
    let progress = 0
    let target = 0

    // Determine progress based on badge type
    switch (badge.key) {
      case 'first_bite':
        target = 1
        progress = Math.min(stats.rated_dishes_count, target)
        break
      case 'food_explorer':
        target = 10
        progress = Math.min(stats.rated_dishes_count, target)
        break
      case 'taste_tester':
        target = 25
        progress = Math.min(stats.rated_dishes_count, target)
        break
      case 'super_reviewer':
        target = 100
        progress = Math.min(stats.rated_dishes_count, target)
        break
      case 'top_1_percent_reviewer':
        target = 125
        progress = Math.min(stats.rated_dishes_count, target)
        break
      case 'neighborhood_explorer':
        target = 3
        progress = Math.min(stats.restaurants_rated_count, target)
        break
      case 'city_taster':
        target = 5
        progress = Math.min(stats.restaurants_rated_count, target)
        break
      case 'local_food_scout':
        target = 10
        progress = Math.min(stats.restaurants_rated_count, target)
        break
      case 'restaurant_trailblazer':
        target = 20
        progress = Math.min(stats.restaurants_rated_count, target)
        break
      case 'ultimate_explorer':
        target = 50
        progress = Math.min(stats.restaurants_rated_count, target)
        break
      default:
        target = 1
        progress = unlocked ? 1 : 0
    }

    return {
      ...badge,
      unlocked: !!unlocked,
      unlocked_at: unlocked?.unlocked_at,
      progress,
      target,
      percentage: target > 0 ? Math.round((progress / target) * 100) : 0,
    }
  })

  return {
    badges: badgesWithProgress,
    unlockedBadges: badges,
    stats,
    loading,
    refreshBadges,
    evaluateBadges,
  }
}
