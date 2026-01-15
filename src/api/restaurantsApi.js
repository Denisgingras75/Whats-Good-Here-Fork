import { supabase } from '../lib/supabase'

/**
 * Restaurants API - Centralized data fetching for restaurants
 */

export const restaurantsApi = {
  /**
   * Get all restaurants with dish counts
   * @returns {Promise<Array>} Array of restaurants with dish counts
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          id,
          name,
          address,
          lat,
          lng,
          is_open,
          dishes (id)
        `)
        .order('name')

      if (error) {
        throw error
      }

      // Transform to include dish count
      return (data || []).map(r => ({
        ...r,
        dishCount: r.dishes?.length || 0,
        dishes: undefined, // Remove the dishes array, keep only count
      }))
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      throw error
    }
  },

  /**
   * Get open restaurants
   * @returns {Promise<Array>} Array of open restaurants
   */
  async getOpen() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, address')
        .eq('is_open', true)
        .order('name')

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching open restaurants:', error)
      throw error
    }
  },

  /**
   * Get a single restaurant by ID
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<Object>} Restaurant object
   */
  async getById(restaurantId) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      throw error
    }
  },
}
