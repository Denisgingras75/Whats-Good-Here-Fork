import { supabase } from '../lib/supabase'
import { logger } from '../utils/logger'

export const restaurantClaimsApi = {
  /**
   * Submit a claim for a restaurant
   */
  async submitClaim({ restaurantId, businessRole, verificationMethod, verificationNotes }) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('You must be logged in to claim a restaurant')
    }

    const { data, error } = await supabase
      .from('restaurant_claims')
      .insert({
        restaurant_id: restaurantId,
        user_id: user.id,
        business_role: businessRole,
        verification_method: verificationMethod,
        verification_notes: verificationNotes,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      logger.error('Error submitting restaurant claim:', error)
      // Handle specific error cases
      if (error.code === '23505') {
        throw new Error('You already have a pending claim for this restaurant')
      }
      throw error
    }

    return data
  },

  /**
   * Get user's claims with restaurant info
   */
  async getUserClaims() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('restaurant_claims')
      .select(`
        *,
        restaurants (
          id,
          name,
          town,
          address
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user claims:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get a specific claim by ID
   */
  async getClaimById(claimId) {
    const { data, error } = await supabase
      .from('restaurant_claims')
      .select(`
        *,
        restaurants (
          id,
          name,
          town,
          address
        )
      `)
      .eq('id', claimId)
      .single()

    if (error) {
      logger.error('Error fetching claim:', error)
      throw error
    }

    return data
  },

  /**
   * Check if user has a pending claim for a restaurant
   */
  async hasPendingClaim(restaurantId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('restaurant_claims')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (error) {
      logger.error('Error checking pending claim:', error)
      return false
    }

    return !!data
  },

  /**
   * Cancel a pending claim
   */
  async cancelClaim(claimId) {
    const { error } = await supabase
      .from('restaurant_claims')
      .delete()
      .eq('id', claimId)

    if (error) {
      logger.error('Error canceling claim:', error)
      throw error
    }

    return true
  },

  /**
   * Update verification notes on a pending claim
   */
  async updateClaimNotes(claimId, verificationNotes) {
    const { data, error } = await supabase
      .from('restaurant_claims')
      .update({ verification_notes: verificationNotes })
      .eq('id', claimId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating claim:', error)
      throw error
    }

    return data
  },

  // ============================================
  // ADMIN FUNCTIONS
  // ============================================

  /**
   * Get all pending claims (admin only)
   */
  async getPendingClaims() {
    const { data, error } = await supabase
      .from('restaurant_claims')
      .select(`
        *,
        restaurants (
          id,
          name,
          town,
          address
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      logger.error('Error fetching pending claims:', error)
      throw error
    }

    return data || []
  },

  /**
   * Approve a claim (admin only)
   */
  async approveClaim(claimId, adminNotes = null) {
    const { data, error } = await supabase
      .rpc('approve_restaurant_claim', {
        claim_id: claimId,
        admin_notes_text: adminNotes
      })

    if (error) {
      logger.error('Error approving claim:', error)
      throw error
    }

    return data
  },

  /**
   * Reject a claim (admin only)
   */
  async rejectClaim(claimId, reason, adminNotes = null) {
    const { data, error } = await supabase
      .rpc('reject_restaurant_claim', {
        claim_id: claimId,
        reason,
        admin_notes_text: adminNotes
      })

    if (error) {
      logger.error('Error rejecting claim:', error)
      throw error
    }

    return data
  }
}
