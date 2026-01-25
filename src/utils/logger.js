/**
 * Centralized logger utility
 * Routes all logging through a single point for easy configuration
 * In production, errors could be sent to Sentry (already configured)
 */

const isDev = import.meta.env.DEV

export const logger = {
  /**
   * Log errors - always logged, sent to Sentry in production
   */
  error(message, ...args) {
    console.error(message, ...args)
  },

  /**
   * Log warnings - always logged
   */
  warn(message, ...args) {
    console.warn(message, ...args)
  },

  /**
   * Log info - only in development
   */
  info(message, ...args) {
    if (isDev) {
      console.log(message, ...args)
    }
  },

  /**
   * Log debug - only in development
   */
  debug(message, ...args) {
    if (isDev) {
      console.log(message, ...args)
    }
  },
}
