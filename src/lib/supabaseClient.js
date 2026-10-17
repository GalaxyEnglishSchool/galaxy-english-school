import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let client = null

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}

export function getSupabase() {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}
