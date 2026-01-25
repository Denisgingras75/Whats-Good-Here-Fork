// Centralized tag definitions for cuisines, styles, and dietary preferences

// Cuisine types - stored on restaurants, inherited by dishes
export const CUISINE_TYPES = [
  { id: 'american', label: 'American' },
  { id: 'asian', label: 'Asian' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'italian', label: 'Italian' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'thai', label: 'Thai' },
  { id: 'soul-food', label: 'Soul Food' },
  { id: 'seafood', label: 'Seafood' },
]

// Style tags - stored on dishes
export const STYLE_TAGS = [
  { id: 'smash', label: 'Smash' },
  { id: 'caesar', label: 'Caesar' },
  { id: 'buffalo', label: 'Buffalo' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'spicy', label: 'Spicy' },
]

// Dietary tags - stored on dishes
export const DIETARY_TAGS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
]

// All tags combined for search matching
export const ALL_TAGS = [...CUISINE_TYPES, ...STYLE_TAGS, ...DIETARY_TAGS]

// Get tag by id
export function getTagById(id) {
  return ALL_TAGS.find(tag => tag.id.toLowerCase() === id?.toLowerCase())
}

// Get tag label by id
export function getTagLabel(id) {
  const tag = getTagById(id)
  return tag?.label || id
}

// Match search term to tags (for autocomplete)
export function matchTags(searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) return []

  const term = searchTerm.toLowerCase().trim()

  return ALL_TAGS
    .map(tag => {
      const id = tag.id.toLowerCase()
      const label = tag.label.toLowerCase()

      // Exact match
      if (id === term || label === term) {
        return { ...tag, score: 100 }
      }

      // Starts with
      if (id.startsWith(term) || label.startsWith(term)) {
        return { ...tag, score: 80 }
      }

      // Contains
      if (id.includes(term) || label.includes(term)) {
        return { ...tag, score: 60 }
      }

      return { ...tag, score: 0 }
    })
    .filter(tag => tag.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}
