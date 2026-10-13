const CITY_TOKEN = 'sambhajinagar'
const CITY_SUFFIX = ' Sambhajinagar'

/**
 * Bus routes use Sambhajinagar — append the city name when missing (no comma).
 */
export function normalizeStudentHomeAddress(raw) {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed) return ''

  if (trimmed.toLocaleLowerCase('en-IN').includes(CITY_TOKEN)) {
    return trimmed.replace(/\s*,\s*Chh\.?\s*Sambhajinagar/gi, ' Sambhajinagar').replace(/\s+/g, ' ').trim()
  }

  const base = trimmed.replace(/[,.\s]+$/, '').trim()
  return `${base}${CITY_SUFFIX}`
}
