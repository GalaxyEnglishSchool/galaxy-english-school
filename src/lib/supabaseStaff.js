import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from './supabaseClient'

/** Staff session (persisted) — for reading analytics in office. */
let staffClient = null

export function getSupabaseStaff() {
  if (!isSupabaseConfigured()) return null
  if (!staffClient) {
    staffClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      { auth: { persistSession: true, autoRefreshToken: true } },
    )
  }
  return staffClient
}
