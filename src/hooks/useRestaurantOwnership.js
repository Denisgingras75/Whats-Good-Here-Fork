import { useState, useEffect, useCallback } from 'react'
import { restaurantUsersApi } from '../api/restaurantUsersApi'
import { restaurantClaimsApi } from '../api/restaurantClaimsApi'
import { logger } from '../utils/logger'

/**
 * Hook for checking restaurant ownership status
 * @param {string} restaurantId - The restaurant to check
 * @returns {{ isClaimed, isOwnedByCurrentUser, canManage, hasPendingClaim, loading }}
 */
export function useRestaurantOwnership(restaurantId) {
  const [status, setStatus] = useState({
    isClaimed: false,
    isOwnedByCurrentUser: false,
    canManage: false,
    hasPendingClaim: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!restaurantId) {
      setStatus({
        isClaimed: false,
        isOwnedByCurrentUser: false,
        canManage: false,
        hasPendingClaim: false
      })
      setLoading(false)
      return
    }

    async function fetchStatus() {
      setLoading(true)
      try {
        const [ownershipStatus, pendingClaim] = await Promise.all([
          restaurantUsersApi.getOwnershipStatus(restaurantId),
          restaurantClaimsApi.hasPendingClaim(restaurantId)
        ])

        setStatus({
          ...ownershipStatus,
          hasPendingClaim: pendingClaim
        })
      } catch (error) {
        logger.error('Error fetching ownership status:', error)
      }
      setLoading(false)
    }

    fetchStatus()
  }, [restaurantId])

  return {
    ...status,
    loading
  }
}

/**
 * Hook for managing user's restaurant portfolio
 * @returns {{ restaurants, loading, refetch }}
 */
export function useMyRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const data = await restaurantUsersApi.getMyRestaurants()
      setRestaurants(data)
    } catch (error) {
      logger.error('Error fetching my restaurants:', error)
      setRestaurants([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  return {
    restaurants,
    loading,
    refetch: fetchRestaurants
  }
}

/**
 * Hook for managing user's restaurant claims
 * @returns {{ claims, loading, submitClaim, cancelClaim, refetch }}
 */
export function useRestaurantClaims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchClaims = useCallback(async () => {
    setLoading(true)
    try {
      const data = await restaurantClaimsApi.getUserClaims()
      setClaims(data)
    } catch (error) {
      logger.error('Error fetching claims:', error)
      setClaims([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  const submitClaim = useCallback(async (claimData) => {
    setSubmitting(true)
    try {
      const newClaim = await restaurantClaimsApi.submitClaim(claimData)
      setClaims(prev => [newClaim, ...prev])
      return { data: newClaim, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setSubmitting(false)
    }
  }, [])

  const cancelClaim = useCallback(async (claimId) => {
    try {
      await restaurantClaimsApi.cancelClaim(claimId)
      setClaims(prev => prev.filter(c => c.id !== claimId))
      return { error: null }
    } catch (error) {
      return { error }
    }
  }, [])

  return {
    claims,
    loading,
    submitting,
    submitClaim,
    cancelClaim,
    refetch: fetchClaims
  }
}
