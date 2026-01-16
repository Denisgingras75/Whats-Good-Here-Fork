import { supabase } from '../lib/supabase'
import { classifyError } from '../utils/errorHandler'

/**
 * Dishes API - Centralized data fetching for dishes
 */

export const dishesApi = {
  /**
   * Get ranked dishes by location with optional filters
   * @param {Object} params
   * @param {number} params.lat - User latitude
   * @param {number} params.lng - User longitude
   * @param {number} params.radiusMiles - Search radius in miles
   * @param {string|null} params.category - Optional category filter
   * @returns {Promise<Array>} Array of ranked dishes
   * @throws {Error} With classified error type
   */
  async getRankedDishes({ lat, lng, radiusMiles, category = null }) {
    try {
      const { data, error } = await supabase.rpc('get_ranked_dishes', {
        user_lat: lat,
        user_lng: lng,
        radius_miles: radiusMiles,
        filter_category: category,
      })

      if (error) {
        const classifiedError = new Error(error.message)
        classifiedError.type = classifyError(error)
        classifiedError.originalError = error
        throw classifiedError
      }

      return data || []
    } catch (error) {
      console.error('Error fetching ranked dishes:', error)
      throw error
    }
  },

  /**
   * Get dishes for a specific restaurant
   * @param {Object} params
   * @param {string} params.restaurantId - Restaurant ID
   * @param {string|null} params.category - Optional category filter
   * @returns {Promise<Array>} Array of dishes
   * @throws {Error} With classified error type
   */
  async getDishesForRestaurant({ restaurantId, category = null }) {
    try {
      let query = supabase
        .from('dishes')
        .select(`
          id,
          name,
          category,
          price,
          photo_url,
          restaurant_id,
          restaurants!inner (
            id,
            name,
            address,
            lat,
            lng,
            is_open
          )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('restaurants.is_open', true)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        const classifiedError = new Error(error.message)
        classifiedError.type = classifyError(error)
        classifiedError.originalError = error
        throw classifiedError
      }

      // Transform data to match the format from get_ranked_dishes
      return (data || []).map(dish => ({
        dish_id: dish.id,
        dish_name: dish.name,
        restaurant_id: dish.restaurant_id,
        restaurant_name: dish.restaurants.name,
        category: dish.category,
        price: dish.price,
        photo_url: dish.photo_url,
        total_votes: 0,
        yes_votes: 0,
        percent_worth_it: 0,
        distance_miles: 0,
      }))
    } catch (error) {
      console.error('Error fetching restaurant dishes:', error)
      throw error
    }
  },

  /**
   * Search dishes by name (for autocomplete)
   * @param {string} query - Search query
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Array of matching dishes
   */
  async search(query, limit = 5) {
    try {
      if (!query?.trim()) return []

      const { data, error } = await supabase
        .from('dishes')
        .select(`
          id,
          name,
          category,
          restaurants!inner (
            id,
            name,
            is_open
          )
        `)
        .eq('restaurants.is_open', true)
        .ilike('name', `%${query}%`)
        .limit(limit)

      if (error) {
        throw error
      }

      // Transform to match expected format
      return (data || []).map(dish => ({
        dish_id: dish.id,
        dish_name: dish.name,
        category: dish.category,
        restaurant_id: dish.restaurants.id,
        restaurant_name: dish.restaurants.name,
      }))
    } catch (error) {
      console.error('Error searching dishes:', error)
      return []
    }
  },

  /**
   * Get a single dish by ID
   * @param {string} dishId - Dish ID
   * @returns {Promise<Object>} Dish object
   * @throws {Error} With classified error type
   */
  async getDishById(dishId) {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            lat,
            lng
          )
        `)
        .eq('id', dishId)
        .single()

      if (error) {
        const classifiedError = new Error(error.message)
        classifiedError.type = classifyError(error)
        classifiedError.originalError = error
        throw classifiedError
      }

      return data
    } catch (error) {
      console.error('Error fetching dish:', error)
      throw error
    }
  },
}
