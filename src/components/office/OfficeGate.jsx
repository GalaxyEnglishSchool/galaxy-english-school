import { useState } from 'react'
import { isOfficeUnlocked, unlockOffice } from '../../utils/officeAuth'
import { site } from '../../data/siteData'
import './OfficeGate.css'

function OfficeGate({ children }) {
  const [unlocked, setUnlocked] = useState(isOfficeUnlocked)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (unlockOffice(password)) {
      setUnlocked(true)
      setError('')
      return
    }
    setError('Incorrect password. Please try again.')
    setPassword('')
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
          <button type="submit" className="btn btn--primary btn--full">
            Unlock office tools
          </button>
        </form>
      </div>
    </div>
  )
}

export default OfficeGate
