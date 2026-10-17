import { formatShortPeriodLabel } from '../../utils/formatAnalytics'

/**
 * @param {{ period_start: string, page_views: number, unique_visitors: number, engaged_seconds: number }[]} rows
 * @param {'day'|'month'|'year'} range
 */
export default function AnalyticsBarChart({ rows, range, metric, title, barClass }) {
  const limit = range === 'day' ? 14 : range === 'month' ? 12 : 8
  const chartRows = [...rows].reverse().slice(-limit)
  const max = Math.max(...chartRows.map((r) => Number(r[metric] ?? 0)), 1)

  if (chartRows.length === 0) {
    return (
      <div className="office-analytics__chart">
        <h4 className="office-analytics__chart-title">{title}</h4>
        <p className="office-analytics__chart-empty">No data for chart yet.</p>
      </div>
    )
  }

  return (
    <div className="office-analytics__chart">
      <h4 className="office-analytics__chart-title">{title}</h4>
      <div className="office-analytics__chart-bars" role="img" aria-label={title}>
        {chartRows.map((row) => {
          const value = Number(row[metric] ?? 0)
          const heightPct = Math.max(4, Math.round((value / max) * 100))
          const label = formatShortPeriodLabel(row.period_start, range)
          return (
            <div key={row.period_start} className="office-analytics__bar-col">
              <span className="office-analytics__bar-value" title={String(value)}>
                {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              </span>
              <div className="office-analytics__bar-track">
                <div
                  className={`office-analytics__bar-fill ${barClass}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="office-analytics__bar-label">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
