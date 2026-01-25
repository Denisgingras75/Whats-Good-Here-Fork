// Category to image URL mapping - v4.0 SUPABASE STORAGE
// Using Supabase storage URLs instead of Unsplash (which is blocked on some networks)
// Base URL for Supabase storage
const SUPABASE_STORAGE = 'https://fzgbxwonitnqmeguqixn.supabase.co/storage/v1/object/public/dish-photos'

export const CATEGORY_IMAGES = {
  'burger': `${SUPABASE_STORAGE}/burger.jpg`,
  'sandwich': `${SUPABASE_STORAGE}/burger.jpg`,
  'breakfast sandwich': `${SUPABASE_STORAGE}/breakfast-sandwich.jpg`,
  'pizza': `${SUPABASE_STORAGE}/burger.jpg`,
  'pasta': `${SUPABASE_STORAGE}/burger.jpg`,
  'sushi': `${SUPABASE_STORAGE}/burger.jpg`,
  'pokebowl': `${SUPABASE_STORAGE}/burger.jpg`,
  'taco': `${SUPABASE_STORAGE}/burger.jpg`,
  'wings': `${SUPABASE_STORAGE}/burger.jpg`,
  'tendys': `${SUPABASE_STORAGE}/burger.jpg`,
  'lobster roll': `${SUPABASE_STORAGE}/burger.jpg`,
  'seafood': `${SUPABASE_STORAGE}/coconut-shrimp.jpg`,
  'chowder': `${SUPABASE_STORAGE}/burger.jpg`,
  'soup': `${SUPABASE_STORAGE}/chili.jpg`,
  'breakfast': `${SUPABASE_STORAGE}/breakfast-sandwich.jpg`,
  'salad': `${SUPABASE_STORAGE}/burger.jpg`,
  'fries': `${SUPABASE_STORAGE}/burger.jpg`,
  'apps': `${SUPABASE_STORAGE}/chips-queso.jpg`,
  'fried chicken': `${SUPABASE_STORAGE}/burger.jpg`,
  'entree': `${SUPABASE_STORAGE}/burger.jpg`,
  'steak': `${SUPABASE_STORAGE}/burger.jpg`,
  'chicken': `${SUPABASE_STORAGE}/chicken-pakora.jpg`,
  'donuts': `${SUPABASE_STORAGE}/burger.jpg`,
  'asian': `${SUPABASE_STORAGE}/burger.jpg`,
  'quesadilla': `${SUPABASE_STORAGE}/burger.jpg`,
}

// Fallback image - burger from Supabase storage
export const DEFAULT_DISH_IMAGE = `${SUPABASE_STORAGE}/burger.jpg`

// Get image URL for a category (silently falls back to default)
export function getCategoryImage(category) {
  if (!category) {
    return DEFAULT_DISH_IMAGE
  }

  const lowerCategory = category.toLowerCase().trim()
  return CATEGORY_IMAGES[lowerCategory] || DEFAULT_DISH_IMAGE
}
