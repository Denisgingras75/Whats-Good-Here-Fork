/**
 * ThumbsUpIcon - Neon thumbs up icon to replace emoji
 */

export function ThumbsUpIcon({ size = 20, className = '', active = false }) {
  return (
    <img
      src="/thumbs-up.png"
      alt="thumbs up"
      className={`inline-block object-contain ${className}`}
      style={{
        width: size,
        height: size,
        filter: active ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  )
}

export default ThumbsUpIcon
