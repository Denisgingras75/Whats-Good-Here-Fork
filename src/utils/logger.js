/**
 * Development-only logger
 * Silences all console output in production builds
 */

const isDev = import.meta.env.DEV

export const logger = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => isDev && console.error(...args),
  warn: (...args) => isDev && console.warn(...args),
  info: (...args) => isDev && console.info(...args),
  debug: (...args) => isDev && console.debug(...args),
}

export default logger
