import { useCallback, useEffect, useState } from 'react'
import { isOfficeUnlocked, unlockOffice } from '../../utils/officeAuth'
import {
  getOfficeSupabaseSession,
  signInOfficeStaff,
} from '../../utils/officeSupabaseAuth'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { site } from '../../data/siteData'
import OfficeDatabaseConnect from './OfficeDatabaseConnect'
import './OfficeGate.css'

function OfficeGate({ children }) {
  const [unlocked, setUnlocked] = useState(isOfficeUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dbSession, setDbSession] = useState(null)
  const [checkingDb, setCheckingDb] = useState(false)

  const refreshDbSession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setDbSession(null)
      return
    }
    setCheckingDb(true)
    const session = await getOfficeSupabaseSession()
    setDbSession(session)
    setCheckingDb(false)
  }, [])

  useEffect(() => {
    if (!unlocked) {
      setDbSession(null)
      return
    }
    refreshDbSession()
  }, [unlocked, refreshDbSession])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!unlockOffice(password)) {
      setError('Incorrect password. Please try again.')
      setPassword('')
      return
    }

    setUnlocked(true)
    setError('')
    setSubmitting(true)
    const auth = await signInOfficeStaff(password)
    setSubmitting(false)

    if (!auth.skipped && !auth.ok) {
      setError(`Office unlocked. Cloud save needs a fix: ${auth.error}`)
      await refreshDbSession()
      return
    }

    await refreshDbSession()
    setPassword('')
  }

  if (!unlocked) {
    return (
      <div className="office-gate">
        <div className="office-gate__card">
          <span className="office-gate__icon" aria-hidden="true">🔒</span>
          <h2>Office access</h2>
          <p>
            {site.name} office tools are for staff only. Enter the office password to continue.
          </p>
          <form className="office-gate__form" onSubmit={handleSubmit}>
            <label className="office-gate__label" htmlFor="office-password">
              Password
            </label>
            <input
              id="office-password"
              type="password"
              className="office-gate__input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter office password"
              autoComplete="current-password"
              autoFocus
            />
            {error && <p className="office-gate__error" role="alert">{error}</p>}
            {isSupabaseConfigured() && (
              <p className="office-gate__hint">
                Same password must work for Supabase staff user (see supabase/README.md).
              </p>
            )}
            <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Unlock office tools'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      {isSupabaseConfigured() && !checkingDb && !dbSession && (
        <OfficeDatabaseConnect onConnected={refreshDbSession} />
      )}
      {children}
    </>
  )
}

export default OfficeGate
