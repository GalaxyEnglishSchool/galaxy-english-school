import { contact } from '../data/siteData'

/** Digits only for wa.me; defaults to school number. */
export function normalizeWhatsAppPhone(phone) {
  if (!phone) return contact.phoneLink
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length >= 11) return digits
  return contact.phoneLink
}

export function buildWhatsAppUrl(message, phone) {
  const link = phone ? normalizeWhatsAppPhone(phone) : contact.phoneLink
  return `https://wa.me/${link}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(message, phone) {
  window.open(buildWhatsAppUrl(message, phone), '_blank', 'noopener,noreferrer')
}

function triggerPdfDownload(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 3000)
}

/**
 * Share a PDF on WhatsApp when the device supports file share; otherwise download PDF and open chat with a short note.
 */
export async function sharePdfOnWhatsApp({ blob, fileName, message, parentPhone }) {
  const file = new File([blob], fileName, { type: 'application/pdf' })
  const text = (message || '').trim()

  if (typeof navigator.share === 'function') {
    try {
      const canShareFiles =
        typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file] })
      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: fileName,
          text,
        })
        return { mode: 'share' }
      }
    } catch (err) {
      if (err?.name === 'AbortError') return { mode: 'cancelled' }
    }
  }

  triggerPdfDownload(blob, fileName)
  const note = text
    ? `${text}\n\nPDF saved as "${fileName}" — please attach it in WhatsApp.`
    : `PDF saved as "${fileName}" — please attach it in WhatsApp.`
  openWhatsApp(note, parentPhone)
  return { mode: 'download' }
}
