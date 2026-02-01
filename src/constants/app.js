// App-wide constants

// Minimum votes required for a dish to be considered "ranked"
// Dishes with fewer votes show as "Early" with less prominent display
export const MIN_VOTES_FOR_RANKING = 5

// Maximum character length for review text
export const MAX_REVIEW_LENGTH = 200

// Consensus thresholds for dish quality labels
// Based on % who would order again
export const CONSENSUS_THRESHOLDS = {
  CERTIFIED: 80,    // "Certified Good Here" - high confidence recommendation
  GOOD: 65,         // "Good Here" - solid choice
  MIXED: 50,        // "Mixed Reviews" - proceed with caution
  RISKY: 50,        // Below this = "Risky" - probably avoid
}

// Minimum votes required to show consensus badges
// Lower than ranking threshold to give early signal
export const MIN_VOTES_FOR_CONSENSUS = 5
