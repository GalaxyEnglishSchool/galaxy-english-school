import { useState } from 'react'
import {
  getOfficeStaffEmail,
  getOfficeSupabaseSession,
  signInOfficeStaff,
} from '../../utils/officeSupabaseAuth'
import './OfficeDatabaseConnect.css'

function OfficeDatabaseConnect({ onConnected }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const staffEmail = getOfficeStaffEmail()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const auth = await signInOfficeStaff(password)
    setSubmitting(false)

    if (!auth.ok) {
      setError(auth.error || 'Sign-in failed.')
      return
    }

    const session = await getOfficeSupabaseSession()
    if (!session) {
      setError('Sign-in did not create a session. Check Supabase Auth settings.')
      return
    }

    setPassword('')
    onConnected?.()
  }

  return (
    <div className="office-db-connect" role="region" aria-label="Connect to school database">
      <div className="office-db-connect__inner">
        <p className="office-db-connect__title">Connect cloud save</p>
        <p className="office-db-connect__text">
          Enter your <strong>office password</strong> again so test results can save to Supabase.
          {staffEmail ? (
            <> Staff login: <strong>{staffEmail}</strong> (must match Authentication → Users).</>
          ) : (
            <> Set <code>VITE_SUPABASE_OFFICE_EMAIL</code> in <code>.env.local</code>.</>
          )}
        </p>
        <form className="office-db-connect__form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="office-db-connect__input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Office password"
            autoComplete="current-password"
          />
          <button type="submit" className="btn btn--primary" disabled={submitting || !password}>
            {submitting ? 'Connecting…' : 'Connect'}
          </button>
        </form>
        {error && <p className="office-db-connect__error" role="alert">{error}</p>}
      </div>
    </div>
  )
}

export default OfficeDatabaseConnect
