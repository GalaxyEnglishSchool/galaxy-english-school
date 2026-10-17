const IST = 'Asia/Kolkata'

export function formatEngagedDuration(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  if (m < 60) return rem ? `${m}m ${rem}s` : `${m}m`
  const h = Math.floor(m / 60)
  const min = m % 60
  return min ? `${h}h ${min}m` : `${h}h`
}

export function formatPeriodLabel(periodStart, range) {
  if (!periodStart) return '—'
  const d = new Date(`${periodStart}T12:00:00`)
  if (Number.isNaN(d.getTime())) return periodStart

  if (range === 'year') {
    return d.toLocaleDateString('en-IN', { year: 'numeric', timeZone: IST })
  }
  if (range === 'month') {
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: IST })
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: IST,
  })
}

export const ANALYTICS_VIEWS = {
  day: { table: 'analytics_daily', label: 'Daily', limit: 90, chartBars: 14 },
  month: { table: 'analytics_monthly', label: 'Monthly', limit: 36, chartBars: 12 },
  year: { table: 'analytics_yearly', label: 'Yearly', limit: 10, chartBars: 8 },
}

export function formatShortPeriodLabel(periodStart, range) {
  if (!periodStart) return ''
  const d = new Date(`${periodStart}T12:00:00`)
  if (Number.isNaN(d.getTime())) return periodStart
  if (range === 'year') {
    return d.toLocaleDateString('en-IN', { year: '2-digit', timeZone: IST })
  }
  if (range === 'month') {
    return d.toLocaleDateString('en-IN', { month: 'short', timeZone: IST })
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: IST })
}
