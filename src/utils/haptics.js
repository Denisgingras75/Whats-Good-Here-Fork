/**
 * Haptic feedback utilities for mobile devices
 * Uses the Vibration API where supported
 */

/**
 * Light haptic feedback for subtle interactions
 * (button taps, selections)
 */
export function hapticLight() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10)
  }
}

/**
 * Medium haptic feedback for confirmations
 * (successful actions, votes submitted)
 */
export function hapticMedium() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(25)
  }
}

/**
 * Heavy haptic feedback for important actions
 * (errors, warnings, destructive actions)
 */
export function hapticHeavy() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50)
  }
}

/**
 * Success haptic pattern - two quick pulses
 */
export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([15, 50, 15])
  }
}

/**
 * Error haptic pattern - longer pulse
 */
export function hapticError() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([50, 30, 50])
  }
}
