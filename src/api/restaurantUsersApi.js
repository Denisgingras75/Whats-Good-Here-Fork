import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'

export const restaurantUsersApi = {
  /**
   * Get restaurants owned/managed by the current user
   */
  async getMyRestaurants() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('restaurant_users')
      .select(`
        *,
        restaurants (
          id,
          name,
          town,
          address,
          lat,
          lng
        )
      `)
      .eq('user_id', user.id)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user restaurants:', error)
      throw error
    }

    return data || []
  },

  /**
   * Check if user owns/manages a specific restaurant
   */
  async canManageRestaurant(restaurantId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('restaurant_users')
      .select('id, role')
      .eq('restaurant_id', restaurantId)
      .eq('user_id', user.id)
      .eq('is_verified', true)
      .maybeSingle()

    if (error) {
      logger.error('Error checking restaurant ownership:', error)
      return false
    }

    return !!data
  },

  /**
   * Check if user is the owner (not just manager) of a restaurant
   */
  async isOwner(restaurantId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('restaurant_users')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('user_id', user.id)
      .eq('is_verified', true)
      .eq('role', 'owner')
      .maybeSingle()

    if (error) {
      logger.error('Error checking restaurant ownership:', error)
      return false
    }

    return !!data
  },

  /**
   * Get all team members for a restaurant (owner view)
   */
  async getRestaurantTeam(restaurantId) {
    const { data, error } = await supabase
      .from('restaurant_users')
      .select(`
        *,
        profiles:user_id (
          display_name,
          avatar_url
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('role', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching restaurant team:', error)
      throw error
    }

    return data || []
  },

  /**
   * Check if a restaurant has an owner
   */
  async restaurantHasOwner(restaurantId) {
    const { data, error } = await supabase
      .from('restaurant_users')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('is_verified', true)
      .eq('role', 'owner')
      .maybeSingle()

    if (error) {
      logger.error('Error checking if restaurant has owner:', error)
      return false
    }

    return !!data
  },

  /**
   * Get ownership status for a restaurant (for display)
   * Returns: { isClaimed, isOwnedByCurrentUser, canManage }
   */
  async getOwnershipStatus(restaurantId) {
    const { data: { user } } = await supabase.auth.getUser()

    // Check if restaurant has any verified owner
    const { data: ownerData, error: ownerError } = await supabase
      .from('restaurant_users')
      .select('id, user_id, role')
      .eq('restaurant_id', restaurantId)
      .eq('is_verified', true)

    if (ownerError) {
      logger.error('Error checking ownership status:', ownerError)
      return { isClaimed: false, isOwnedByCurrentUser: false, canManage: false }
    }

    const isClaimed = ownerData && ownerData.length > 0

    if (!user) {
      return { isClaimed, isOwnedByCurrentUser: false, canManage: false }
    }

    const userOwnership = ownerData?.find(o => o.user_id === user.id)

    return {
      isClaimed,
      isOwnedByCurrentUser: userOwnership?.role === 'owner',
      canManage: !!userOwnership
    }
  }
}
