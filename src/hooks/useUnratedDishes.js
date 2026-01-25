import { useState, useEffect, useCallback } from 'react'
import { dishPhotosApi } from '../api/dishPhotosApi'
import { logger } from '../utils/logger'

/**
 * Hook for fetching dishes that a user has photographed but not rated
 */
export function useUnratedDishes(userId) {
  const [dishes, setDishes] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUnratedDishes = useCallback(async () => {
    if (!userId) {
      setDishes([])
      setCount(0)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await dishPhotosApi.getUnratedDishesWithPhotos(userId)
      setDishes(data)
      setCount(data.length)
    } catch (err) {
      logger.error('Error fetching unrated dishes:', err)
      setError(err.message || 'Failed to fetch unrated dishes')
      setDishes([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUnratedDishes()
  }, [fetchUnratedDishes])

  const refetch = useCallback(async () => {
    await fetchUnratedDishes()
  }, [fetchUnratedDishes])

  return {
    dishes,
    count,
    loading,
    error,
    refetch,
  }
}
