import { contact } from '../data/siteData'

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${contact.phoneLink}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(message) {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
}
