export function getOfficeUrl(tab) {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const path = tab ? `office?tab=${tab}` : 'office'
  return `${base}${path}`
}
