import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient'
import { getOfficeSupabaseSession } from './officeSupabaseAuth'

export async function saveAdmissionRecord(record) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, error: 'Supabase is not configured.' }
  }

  const session = await getOfficeSupabaseSession()
  if (!session) {
    return {
      ok: false,
      skipped: false,
      error: 'Not signed in to database. Lock office and unlock again with your password.',
    }
  }

  const supabase = getSupabaseClient()
  const { error } = await supabase.from('admissions').insert([record])

  if (error) {
    return { ok: false, skipped: false, error: error.message }
  }

  return { ok: true, skipped: false }
}
