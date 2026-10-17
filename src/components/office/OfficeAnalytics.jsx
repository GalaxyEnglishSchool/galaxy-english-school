import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { getSupabaseStaff } from '../../lib/supabaseStaff'
import { ANALYTICS_VIEWS, formatEngagedDuration, formatPeriodLabel } from '../../utils/formatAnalytics'
import AnalyticsBarChart from './AnalyticsBarChart'
import './OfficeAnalytics.css'

const DEFAULT_EMAIL = import.meta.env.VITE_SUPABASE_OFFICE_EMAIL ?? ''

function OfficeAnalytics() {
  const [range, setRange] = useState('day')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) return
    const supabase = getSupabaseStaff()
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => sub.subscription.unsubscribe()
  }, [configured])

  const loadRollups = useCallback(async () => {
    if (!session) return
    const supabase = getSupabaseStaff()
    const meta = ANALYTICS_VIEWS[range]
    if (!supabase || !meta) return

    setLoading(true)
    setError('')
    const { data, error: qErr } = await supabase
      .from(meta.table)
      .select('period_start, page_views, unique_visitors, sessions, engaged_seconds')
      .order('period_start', { ascending: false })
      .limit(meta.limit)

    setLoading(false)
    if (qErr) {
      setError(
        qErr.message.includes('does not exist')
          ? 'Run supabase/analytics_rollups.sql in the SQL Editor, then refresh.'
          : qErr.message,
      )
      setRows([])
      return
    }
    setRows(data ?? [])
  }, [range, session])

  useEffect(() => {
    void loadRollups()
  }, [loadRollups])

  const handleSignIn = async (e) => {
    e.preventDefault()
    const supabase = getSupabaseStaff()
    if (!supabase) return
    setAuthBusy(true)
    setError('')
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
    setAuthBusy(false)
    if (signErr) setError(signErr.message)
    else setPassword('')
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseStaff()
    await supabase?.auth.signOut()
    setRows([])
  }

  const meta = ANALYTICS_VIEWS[range]
  const latest = rows[0]

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          page_views: acc.page_views + Number(row.page_views ?? 0),
          engaged_seconds: acc.engaged_seconds + Number(row.engaged_seconds ?? 0),
        }),
        { page_views: 0, engaged_seconds: 0 },
      ),
    [rows],
  )

  if (!configured) {
    return (
      <div className="office-card office-analytics">
        <h3>Website analytics</h3>
        <p className="office-analytics__muted">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable tracking and
          reports. Run <code>analytics.sql</code> and <code>analytics_rollups.sql</code> in Supabase.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="office-card office-analytics">
        <h3>Website analytics</h3>
        <p className="office-analytics__muted">
          Sign in with your Supabase staff user to view daily, monthly, and yearly visits and watch time (IST).
        </p>
        <form className="office-analytics__login" onSubmit={handleSignIn}>
          <label>
            Staff email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={authBusy}>
            {authBusy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && <p className="office-analytics__error" role="alert">{error}</p>}
      </div>
    )
  }

  return (
    <div className="office-card office-analytics">
      <header className="office-analytics__head">
        <div>
          <h3>Website analytics</h3>
          <p className="office-analytics__muted">Public site only · IST · {session.user.email}</p>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <div className="office-analytics__range" role="tablist" aria-label="Report range">
        {Object.entries(ANALYTICS_VIEWS).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={range === key}
            className={`office-analytics__range-btn${range === key ? ' office-analytics__range-btn--active' : ''}`}
            onClick={() => setRange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="office-analytics__error" role="alert">{error}</p>}

      {loading && <p className="office-analytics__loading">Loading…</p>}

      {!loading && latest && (
        <div className="office-analytics__kpis">
          <div className="office-analytics__kpi">
            <span className="office-analytics__kpi-label">Latest {meta.label.toLowerCase()}</span>
            <strong className="office-analytics__kpi-period">
              {formatPeriodLabel(latest.period_start, range)}
            </strong>
          </div>
          <div className="office-analytics__kpi">
            <span className="office-analytics__kpi-label">Page views</span>
            <strong>{Number(latest.page_views).toLocaleString('en-IN')}</strong>
          </div>
          <div className="office-analytics__kpi">
            <span className="office-analytics__kpi-label">Unique visitors</span>
            <strong>{Number(latest.unique_visitors).toLocaleString('en-IN')}</strong>
          </div>
          <div className="office-analytics__kpi">
            <span className="office-analytics__kpi-label">Watch time</span>
            <strong>{formatEngagedDuration(latest.engaged_seconds)}</strong>
          </div>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="office-analytics__charts">
          <AnalyticsBarChart
            rows={rows}
            range={range}
            metric="page_views"
            title="Page views"
            barClass="office-analytics__bar-fill--views"
          />
          <AnalyticsBarChart
            rows={rows}
            range={range}
            metric="unique_visitors"
            title="Unique visitors"
            barClass="office-analytics__bar-fill--visitors"
          />
        </div>
      )}

      <p className="office-analytics__summary">
        {rows.length > 0 ? (
          <>
            Totals in table: <strong>{totals.page_views.toLocaleString('en-IN')}</strong> page views ·{' '}
            <strong>{formatEngagedDuration(totals.engaged_seconds)}</strong> watch time
          </>
        ) : (
          'No data yet — visit the public homepage (not /office), then refresh.'
        )}
      </p>

      <div className="office-analytics__table-wrap">
        <table className="office-analytics__table">
          <caption className="office-analytics__table-caption">Detailed breakdown</caption>
          <thead>
            <tr>
              <th>Period</th>
              <th>Page views</th>
              <th>Unique visitors</th>
              <th>Sessions</th>
              <th>Watch time</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5}>No rows yet.</td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => (
                <tr key={row.period_start}>
                  <td>{formatPeriodLabel(row.period_start, range)}</td>
                  <td>{Number(row.page_views).toLocaleString('en-IN')}</td>
                  <td>{Number(row.unique_visitors).toLocaleString('en-IN')}</td>
                  <td>{Number(row.sessions).toLocaleString('en-IN')}</td>
                  <td>{formatEngagedDuration(row.engaged_seconds)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="btn btn--secondary btn--sm office-analytics__refresh"
        onClick={loadRollups}
        disabled={loading}
      >
        Refresh
      </button>
    </div>
  )
}

export default OfficeAnalytics
