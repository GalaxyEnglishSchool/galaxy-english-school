import { contact } from '../data/siteData'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving'

let schoolCoordsCache = null

async function geocode(query) {
  const params = new URLSearchParams({
    format: 'json',
    q: query,
    limit: '1',
    countrycodes: 'in',
  })

  const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'Accept-Language': 'en' },
  })

  if (!response.ok) return null

  const results = await response.json()
  if (!results.length) return null

  return {
    lat: Number.parseFloat(results[0].lat),
    lon: Number.parseFloat(results[0].lon),
  }
}

async function getSchoolCoords() {
  if (schoolCoordsCache) return schoolCoordsCache

  const coords = await geocode(contact.address)
  if (coords) schoolCoordsCache = coords
  return coords
}

/** Approximate road distance in km (free OSM routing — no Google API key). */
export async function getDrivingDistanceKm(destination) {
  const trimmed = destination?.trim()
  if (!trimmed) return null

  const origin = await getSchoolCoords()
  const destQuery = trimmed.includes('Sambhajinagar')
    ? trimmed
    : `${trimmed}, Chh. Sambhajinagar, Maharashtra`
  const dest = await geocode(destQuery)

  if (!origin || !dest) return null

  const response = await fetch(
    `${OSRM_URL}/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`,
  )

  if (!response.ok) return null

  const data = await response.json()
  if (data.code !== 'Ok' || !data.routes?.[0]) return null

  const km = data.routes[0].distance / 1000
  return Math.round(km * 10) / 10
}
