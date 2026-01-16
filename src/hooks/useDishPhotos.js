import { useState, useCallback } from 'react'
import { dishPhotosApi } from '../api/dishPhotosApi'

/**
 * Hook for managing photo uploads for dishes
 */
export function useDishPhotos() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadPhoto = useCallback(async (dishId, file) => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate progress for better UX
      setUploadProgress(30)

      const result = await dishPhotosApi.uploadPhoto({ dishId, file })

      setUploadProgress(100)
      return result
    } catch (err) {
      setError(err.message || 'Failed to upload photo')
      throw err
    } finally {
      setUploading(false)
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 500)
    }
  }, [])

  const getUserPhotoForDish = useCallback(async (dishId) => {
    try {
      return await dishPhotosApi.getUserPhotoForDish(dishId)
    } catch (err) {
      console.error('Error getting user photo:', err)
      return null
    }
  }, [])

  const deletePhoto = useCallback(async (photoId) => {
    try {
      await dishPhotosApi.deletePhoto(photoId)
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to delete photo')
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploadPhoto,
    getUserPhotoForDish,
    deletePhoto,
    uploading,
    uploadProgress,
    error,
    clearError,
  }
}
