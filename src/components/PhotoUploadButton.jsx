import { useRef, useState } from 'react'
import { useDishPhotos } from '../hooks/useDishPhotos'
import { useAuth } from '../context/AuthContext'

export function PhotoUploadButton({
  dishId,
  onPhotoUploaded,
  onLoginRequired,
  compact = false,
}) {
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  const { uploadPhoto, uploading, uploadProgress, error, clearError } = useDishPhotos()
  const [localError, setLocalError] = useState(null)

  const handleClick = () => {
    if (!user) {
      onLoginRequired?.()
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLocalError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setLocalError('Image must be under 10MB')
      return
    }

    setLocalError(null)
    clearError()

    try {
      const result = await uploadPhoto(dishId, file)
      onPhotoUploaded?.(result)
    } catch (err) {
      // Error is already set in the hook
    }

    // Clear the input so the same file can be selected again
    e.target.value = ''
  }

  const displayError = localError || error

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={handleClick}
          disabled={uploading}
          className="photo-upload-btn-compact"
          title="Add photo"
        >
          {uploading ? (
            <span className="upload-spinner" />
          ) : (
            <span>📷</span>
          )}
        </button>
      </>
    )
  }

  return (
    <div className="photo-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button
        onClick={handleClick}
        disabled={uploading}
        className="photo-upload-btn"
      >
        {uploading ? (
          <>
            <span className="upload-spinner" />
            <span>Uploading... {uploadProgress}%</span>
          </>
        ) : (
          <>
            <span>📷</span>
            <span>Add Photo</span>
          </>
        )}
      </button>

      {displayError && (
        <p className="photo-upload-error">{displayError}</p>
      )}
    </div>
  )
}
