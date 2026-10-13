import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient'

export function getOfficeStaffEmail() {
  return import.meta.env.VITE_SUPABASE_OFFICE_EMAIL?.trim() || ''
}

/** Sign in to Supabase with the same password staff used for the office gate. */
export async function signInOfficeStaff(password) {
  if (!isSupabaseConfigured()) {
    return { ok: true, skipped: true }
  }

  const email = getOfficeStaffEmail()
  if (!email) {
    return {
      ok: false,
      skipped: false,
      error: 'Add VITE_SUPABASE_OFFICE_EMAIL in .env.local (staff login email from Supabase).',
    }
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, skipped: false, error: 'Supabase client could not be created.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return {
      ok: false,
      skipped: false,
      error: 'Could not sign in to database. Use the same password as Supabase staff user.',
    }
  }

  return { ok: true, skipped: false }
}

export async function getOfficeSupabaseSession() {
  if (!isSupabaseConfigured()) return null
  const supabase = getSupabaseClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}
