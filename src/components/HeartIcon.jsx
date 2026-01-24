/**
 * HeartIcon - Neon heart icon to replace emoji
 */

export function HeartIcon({ size = 20, className = '', active = false }) {
  return (
    <img
      src="/heart.png"
      alt="heart"
      className={`inline-block object-contain ${className}`}
      style={{
        width: size,
        height: size,
        filter: active ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  )
}

export default HeartIcon
