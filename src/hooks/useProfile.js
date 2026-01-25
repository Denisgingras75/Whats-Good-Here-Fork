import { useState, useEffect, useCallback } from 'react'
import { profileApi } from '../api/profileApi'
import { logger } from '../utils/logger'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function fetchProfile() {
      setLoading(true)
      try {
        // API uses auth.getUser() internally for security
        const data = await profileApi.getOrCreateProfile()
        setProfile(data)
      } catch (error) {
        logger.error('Error fetching profile:', error)
        setProfile(null)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  const updateProfile = useCallback(async (updates) => {
    if (!userId) return { error: 'Not logged in' }

    try {
      // API uses auth.getUser() internally for security
      const data = await profileApi.updateProfile(updates)
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }, [userId])

  return {
    profile,
    loading,
    updateProfile,
  }
}
