import { contact } from '../data/siteData'
import { normalizeStudentHomeAddress } from './normalizeHomeAddress'

export const schoolOrigin = {
  label: contact.mapsPlaceName,
  address: contact.address,
}

/** Opens full Google Maps directions in a new tab — no API key needed. */
export function getGoogleMapsDirectionsUrl(destination) {
  const dest = normalizeStudentHomeAddress(destination)
  const params = new URLSearchParams({
    api: '1',
    origin: schoolOrigin.address,
    destination: dest,
    travelmode: 'driving',
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

/** Embeds driving directions in an iframe — no API key needed. */
export function getDirectionsEmbedUrl(destination) {
  const dest = normalizeStudentHomeAddress(destination)
  const params = new URLSearchParams({
    f: 'd',
    saddr: schoolOrigin.address,
    daddr: dest,
    hl: 'en',
    dirflg: 'd',
    output: 'embed',
  })
  // Omit fixed zoom — Google fits the full route so distance is visible in the panel.
  return `https://maps.google.com/maps?${params.toString()}`
}
