import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'

export const dishSuggestionsApi = {
  /**
   * Check rate limit for dish suggestions
   */
  async checkRateLimit() {
    const { data, error } = await supabase
      .rpc('check_dish_suggestion_rate_limit')

    if (error) {
      logger.error('Error checking dish suggestion rate limit:', error)
      return { allowed: true, countToday: 0, limitPerDay: 10 }
    }

    const result = data?.[0] || data
    return {
      allowed: result?.allowed ?? true,
      countToday: result?.count_today ?? 0,
      limitPerDay: result?.limit_per_day ?? 10
    }
  },

  /**
   * Submit a dish suggestion
   */
  async submit({ restaurantId, name, category, price, description }) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('You must be logged in to suggest a dish')
    }

    if (!restaurantId) {
      throw new Error('Please select a restaurant')
    }

    if (!name?.trim()) {
      throw new Error('Please enter a dish name')
    }

    if (!category) {
      throw new Error('Please select a category')
    }

    // Check rate limit
    const { allowed, countToday, limitPerDay } = await this.checkRateLimit()
    if (!allowed) {
      throw new Error(`You've reached the daily limit of ${limitPerDay} dish suggestions. You've submitted ${countToday} today.`)
    }

    const { data, error } = await supabase
      .from('dish_suggestions')
      .insert({
        user_id: user.id,
        restaurant_id: restaurantId,
        name: name.trim(),
        category,
        price: price || null,
        description: description?.trim() || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      logger.error('Error submitting dish suggestion:', error)
      throw error
    }

    return data
  },

  /**
   * Get user's dish suggestions
   */
  async getMySuggestions() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('dish_suggestions')
      .select(`
        *,
        restaurants:restaurant_id (
          id,
          name,
          town
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user dish suggestions:', error)
      throw error
    }

    return data || []
  },

  /**
   * Cancel a pending dish suggestion
   */
  async cancel(suggestionId) {
    const { error } = await supabase
      .from('dish_suggestions')
      .delete()
      .eq('id', suggestionId)

    if (error) {
      logger.error('Error canceling dish suggestion:', error)
      throw error
    }

    return true
  },

  /**
   * Check if a dish already exists at a restaurant
   */
  async checkDuplicate(restaurantId, dishName) {
    if (!restaurantId || !dishName) return { exists: false }

    const { data, error } = await supabase
      .rpc('check_dish_duplicate', {
        p_restaurant_id: restaurantId,
        p_dish_name: dishName
      })

    if (error) {
      logger.error('Error checking dish duplicate:', error)
      return { exists: false }
    }

    const result = data?.[0] || data
    return {
      exists: result?.exists_as_dish || result?.exists_as_suggestion,
      existingDishId: result?.existing_dish_id,
      existingSuggestionId: result?.existing_suggestion_id
    }
  },

  // ============================================
  // ADMIN FUNCTIONS
  // ============================================

  /**
   * Get all pending dish suggestions (admin only)
   */
  async getPending() {
    const { data, error } = await supabase
      .from('dish_suggestions')
      .select(`
        *,
        profiles:user_id (
          display_name
        ),
        restaurants:restaurant_id (
          id,
          name,
          town
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching pending dish suggestions:', error)
      throw error
    }

    return data || []
  },

  /**
   * Approve a dish suggestion (admin only)
   */
  async approve(suggestionId, adminNotes = null) {
    const { data, error } = await supabase
      .rpc('approve_dish_suggestion', {
        suggestion_id: suggestionId,
        admin_notes_text: adminNotes
      })

    if (error) {
      logger.error('Error approving dish suggestion:', error)
      throw error
    }

    return data // Returns the new dish ID
  },

  /**
   * Reject a dish suggestion (admin only)
   */
  async reject(suggestionId, adminNotes = null) {
    const { data, error } = await supabase
      .from('dish_suggestions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', suggestionId)
      .select()
      .single()

    if (error) {
      logger.error('Error rejecting dish suggestion:', error)
      throw error
    }

    return data
  },

  /**
   * Mark as duplicate (admin only)
   */
  async markDuplicate(suggestionId, existingDishId, adminNotes = null) {
    const { data, error } = await supabase
      .from('dish_suggestions')
      .update({
        status: 'duplicate',
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
        created_dish_id: existingDishId
      })
      .eq('id', suggestionId)
      .select()
      .single()

    if (error) {
      logger.error('Error marking dish suggestion as duplicate:', error)
      throw error
    }

    return data
  }
}
