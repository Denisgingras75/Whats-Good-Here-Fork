import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'

export const restaurantSuggestionsApi = {
  /**
   * Submit a restaurant suggestion
   */
  async submit({ name, address, town, osmPlaceId, lat, lng, notes }) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('You must be logged in to suggest a restaurant')
    }

    const { data, error } = await supabase
      .from('restaurant_suggestions')
      .insert({
        user_id: user.id,
        name: name.trim(),
        address: address?.trim() || null,
        town: town || null,
        osm_place_id: osmPlaceId || null,
        lat,
        lng,
        notes: notes?.trim() || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      logger.error('Error submitting restaurant suggestion:', error)
      throw error
    }

    return data
  },

  /**
   * Get user's suggestions
   */
  async getMySuggestions() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('restaurant_suggestions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user suggestions:', error)
      throw error
    }

    return data || []
  },

  /**
   * Cancel a pending suggestion
   */
  async cancel(suggestionId) {
    const { error } = await supabase
      .from('restaurant_suggestions')
      .delete()
      .eq('id', suggestionId)

    if (error) {
      logger.error('Error canceling suggestion:', error)
      throw error
    }

    return true
  },

  /**
   * Check if a restaurant with this OSM ID already exists or is suggested
   */
  async checkDuplicate(osmPlaceId) {
    if (!osmPlaceId) return { exists: false }

    // Check existing suggestions
    const { data: suggestion } = await supabase
      .from('restaurant_suggestions')
      .select('id, name, status')
      .eq('osm_place_id', osmPlaceId)
      .in('status', ['pending', 'approved'])
      .maybeSingle()

    if (suggestion) {
      return { exists: true, type: 'suggestion', data: suggestion }
    }

    return { exists: false }
  },

  // ============================================
  // ADMIN FUNCTIONS
  // ============================================

  /**
   * Get all pending suggestions (admin only)
   */
  async getPending() {
    const { data, error } = await supabase
      .from('restaurant_suggestions')
      .select(`
        *,
        profiles:user_id (
          display_name
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching pending suggestions:', error)
      throw error
    }

    return data || []
  },

  /**
   * Approve a suggestion (admin only)
   */
  async approve(suggestionId, adminNotes = null) {
    const { data, error } = await supabase
      .rpc('approve_restaurant_suggestion', {
        suggestion_id: suggestionId,
        admin_notes_text: adminNotes
      })

    if (error) {
      logger.error('Error approving suggestion:', error)
      throw error
    }

    return data // Returns the new restaurant ID
  },

  /**
   * Reject a suggestion (admin only)
   */
  async reject(suggestionId, adminNotes = null) {
    const { data, error } = await supabase
      .from('restaurant_suggestions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', suggestionId)
      .select()
      .single()

    if (error) {
      logger.error('Error rejecting suggestion:', error)
      throw error
    }

    return data
  },

  /**
   * Mark as duplicate (admin only)
   */
  async markDuplicate(suggestionId, existingRestaurantId, adminNotes = null) {
    const { data, error } = await supabase
      .from('restaurant_suggestions')
      .update({
        status: 'duplicate',
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
        created_restaurant_id: existingRestaurantId
      })
      .eq('id', suggestionId)
      .select()
      .single()

    if (error) {
      logger.error('Error marking suggestion as duplicate:', error)
      throw error
    }

    return data
  }
}
