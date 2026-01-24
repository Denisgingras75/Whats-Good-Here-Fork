/**
 * HeartIcon - Neon heart icon to replace emoji
 */

export function HeartIcon({ size = 20, className = '' }) {
  return (
    <img
      src="/heart.png"
      alt="heart"
      className={`inline-block object-contain ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

export default HeartIcon
