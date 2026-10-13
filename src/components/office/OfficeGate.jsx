import { useState } from 'react'
import { isOfficeUnlocked, unlockOffice } from '../../utils/officeAuth'
import { signInOfficeStaff } from '../../utils/officeSupabaseAuth'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { site } from '../../data/siteData'
import './OfficeGate.css'

function OfficeGate({ children }) {
  const [unlocked, setUnlocked] = useState(isOfficeUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      setError(`Office unlocked. Test save may not work until database login is fixed: ${auth.error}`)
    }
  }

  if (unlocked) return children

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
              Saving tests uses Supabase — use your staff login password (see supabase/README.md).
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

export default OfficeGate
