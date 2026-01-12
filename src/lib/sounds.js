// Simple bite sound system - single sound file
// Place your sound file at /public/sounds/crunch.wav (or .mp3)

let crunchSound = null

// Initialize sound on first user interaction
export function preloadSounds() {
  crunchSound = new Audio('/sounds/crunch.wav')
  crunchSound.preload = 'auto'
  crunchSound.volume = 0.5
}

// Check if sounds are muted
export function isSoundMuted() {
  return localStorage.getItem('soundMuted') === 'true'
}

// Set mute state
export function setSoundMuted(muted) {
  localStorage.setItem('soundMuted', String(muted))
}

// Toggle mute state
export function toggleSoundMute() {
  const newState = !isSoundMuted()
  setSoundMuted(newState)
  return newState
}

// Play the bite sound
export function playBiteSound() {
  if (isSoundMuted()) return
  if (!crunchSound) return

  crunchSound.currentTime = 0
  crunchSound.play().catch(() => {})
}
