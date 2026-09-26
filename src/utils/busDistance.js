import { contact } from '../data/siteData'

export const schoolOrigin = {
  label: contact.mapsPlaceName,
  address: contact.address,
}

/** Opens full Google Maps directions in a new tab — no API key needed. */
export function getGoogleMapsDirectionsUrl(destination) {
  const params = new URLSearchParams({
    api: '1',
    origin: schoolOrigin.address,
    destination,
    travelmode: 'driving',
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

/** Embeds driving directions in an iframe — no API key needed. */
export function getDirectionsEmbedUrl(destination) {
  const params = new URLSearchParams({
    f: 'd',
    saddr: schoolOrigin.address,
    daddr: destination,
    hl: 'en',
    z: '13',
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params.toString()}`
}
