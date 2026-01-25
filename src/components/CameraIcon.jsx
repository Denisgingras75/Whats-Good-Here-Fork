/**
 * CameraIcon - Neon camera icon for "Unrated" section
 */

export function CameraIcon({ size = 20, className = '', active = false }) {
  return (
    <img
      src="/camera.png"
      alt="camera"
      className={`inline-block object-contain ${className}`}
      style={{
        width: size,
        height: size,
        filter: active ? 'brightness(1.3) drop-shadow(0 0 3px white)' : 'none',
      }}
    />
  )
}

export default CameraIcon
