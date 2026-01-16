import { supabase } from '../lib/supabase'
import posthog from 'posthog-js'

/**
 * Dish Photos API - Centralized data fetching and mutation for dish photos
 */

export const dishPhotosApi = {
  /**
   * Upload a photo for a dish
   * @param {Object} params
   * @param {string} params.dishId - Dish ID
   * @param {File} params.file - Photo file to upload
   * @returns {Promise<Object>} Photo record
   */
  async uploadPhoto({ dishId, file }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to upload photos')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${dishId}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('dish-photos')
        .upload(fileName, file, {
          upsert: true, // Replace if exists
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dish-photos')
        .getPublicUrl(fileName)

      // Insert or update photo record
      const { data, error } = await supabase
        .from('dish_photos')
        .upsert(
          {
            dish_id: dishId,
            user_id: user.id,
            photo_url: publicUrl,
          },
          {
            onConflict: 'dish_id,user_id',
          }
        )
        .select()
        .single()

      if (error) {
        throw error
      }

      posthog.capture('photo_uploaded', {
        dish_id: dishId,
      })

      return data
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  },

  /**
   * Get all photos for a dish
   * @param {string} dishId - Dish ID
   * @returns {Promise<Array>} Array of photo records
   */
  async getPhotosForDish(dishId) {
    try {
      const { data, error } = await supabase
        .from('dish_photos')
        .select('*')
        .eq('dish_id', dishId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching dish photos:', error)
      throw error
    }
  },

  /**
   * Get dishes that a user has photographed but not voted on
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of dishes with photos but no votes
   */
  async getUnratedDishesWithPhotos(userId) {
    try {
      if (!userId) {
        return []
      }

      // Get photos by user
      const { data: photos, error: photosError } = await supabase
        .from('dish_photos')
        .select(`
          id,
          photo_url,
          created_at,
          dishes (
            id,
            name,
            category,
            price,
            photo_url,
            restaurants (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (photosError) {
        throw photosError
      }

      if (!photos?.length) {
        return []
      }

      // Get user's votes to filter out rated dishes
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('dish_id')
        .eq('user_id', userId)

      if (votesError) {
        throw votesError
      }

      const votedDishIds = new Set((votes || []).map(v => v.dish_id))

      // Filter to only unrated dishes and transform
      return photos
        .filter(photo => !votedDishIds.has(photo.dishes.id))
        .map(photo => ({
          photo_id: photo.id,
          user_photo_url: photo.photo_url,
          photo_created_at: photo.created_at,
          dish_id: photo.dishes.id,
          dish_name: photo.dishes.name,
          category: photo.dishes.category,
          price: photo.dishes.price,
          photo_url: photo.dishes.photo_url,
          restaurant_id: photo.dishes.restaurants.id,
          restaurant_name: photo.dishes.restaurants.name,
        }))
    } catch (error) {
      console.error('Error fetching unrated dishes:', error)
      throw error
    }
  },

  /**
   * Check if user has uploaded a photo for a dish
   * @param {string} dishId - Dish ID
   * @returns {Promise<Object|null>} Photo record if exists
   */
  async getUserPhotoForDish(dishId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return null
      }

      const { data, error } = await supabase
        .from('dish_photos')
        .select('*')
        .eq('dish_id', dishId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user photo:', error)
      return null
    }
  },

  /**
   * Delete a photo
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Success status
   */
  async deletePhoto(photoId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Get photo record to get file path
      const { data: photo, error: fetchError } = await supabase
        .from('dish_photos')
        .select('photo_url, dish_id')
        .eq('id', photoId)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !photo) {
        throw new Error('Photo not found or access denied')
      }

      // Delete from storage
      const fileName = `${user.id}/${photo.dish_id}`
      await supabase.storage
        .from('dish-photos')
        .remove([`${fileName}.jpg`, `${fileName}.jpeg`, `${fileName}.png`])

      // Delete record
      const { error } = await supabase
        .from('dish_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting photo:', error)
      throw error
    }
  },

  /**
   * Get count of unrated dishes with photos for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of unrated dishes
   */
  async getUnratedCount(userId) {
    try {
      if (!userId) {
        return 0
      }

      const unrated = await this.getUnratedDishesWithPhotos(userId)
      return unrated.length
    } catch (error) {
      console.error('Error getting unrated count:', error)
      return 0
    }
  },
}
