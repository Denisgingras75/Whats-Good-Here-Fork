/**
 * Cached localStorage wrapper
 * Avoids repeated synchronous reads from localStorage
 */

const cache = new Map()

/**
 * Get item from localStorage with in-memory caching
 * @param {string} key - Storage key
 * @returns {string|null} - Stored value or null
 */
export function getStorageItem(key) {
  if (cache.has(key)) {
    return cache.get(key)
  }
  try {
    const value = localStorage.getItem(key)
    cache.set(key, value)
    return value
  } catch {
    return null
  }
}

/**
 * Set item in localStorage and update cache
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value)
    cache.set(key, value)
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

/**
 * Remove item from localStorage and cache
 * @param {string} key - Storage key
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
    cache.delete(key)
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Clear specific keys from cache (useful for testing)
 * @param {string[]} keys - Keys to clear from cache
 */
export function clearCacheKeys(keys) {
  keys.forEach(key => cache.delete(key))
}
