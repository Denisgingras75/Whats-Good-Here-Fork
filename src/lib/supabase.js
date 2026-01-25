import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Throw in production if not configured - don't mask the error
if (!isSupabaseConfigured) {
  const message = 'Supabase not configured: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required'
  if (import.meta.env.PROD) {
    throw new Error(`[CRITICAL] ${message}`)
  } else {
    logger.error(`[DEV] ${message} - App will not function correctly!`)
  }
}

// Create client - require real config (no silent placeholders)
// SECURITY NOTE: Session tokens are stored in localStorage for persistence across page reloads.
// This is a Supabase SDK limitation - tokens are accessible to JavaScript and could be stolen via XSS.
// Mitigations: Strict CSP headers, input sanitization, short token expiry with auto-refresh.
// Alternative (in-memory storage) would break session persistence and require re-login on every page load.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'whats-good-here-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
)
