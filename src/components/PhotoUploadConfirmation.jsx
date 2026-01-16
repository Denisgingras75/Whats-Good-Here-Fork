export function PhotoUploadConfirmation({
  dishName,
  photoUrl,
  onRateNow,
  onLater,
}) {
  return (
    <div className="photo-upload-confirmation">
      <div className="photo-preview">
        <img src={photoUrl} alt={dishName} />
        <div className="checkmark">✓</div>
      </div>

      <h3>Photo Added!</h3>
      <p>Would you like to rate this dish now?</p>

      <div className="confirmation-buttons">
        <button
          onClick={onRateNow}
          className="btn-primary"
        >
          Rate Now
        </button>
        <button
          onClick={onLater}
          className="btn-secondary"
        >
          Later
        </button>
      </div>

      <p className="hint">
        You can rate this dish anytime from your Profile
      </p>
    </div>
  )
}
