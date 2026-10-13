import { photoCaptions } from '../data/siteData'

/** Campus gallery only — not logos, Joy sprites, or About-only composites. */
const GALLERY_EXCLUDE = new Set([
  'school.png',
  'joy-hi.png',
  'joy-running.png',
  'joy-standing.png',
  'Hi.png',
  'Running.png',
  'Showwebsite.png',
  'Photos.jpg',
  'ChatGPT Image Sep 30, 2026, 12_08_18 AM - Copy - Copy.png',
])

const photoModules = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  import: 'default',
})

let cachedPhotos = null

function getFilename(path) {
  return path.split('/').pop()
}

function defaultCaption(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  const number = base.match(/(\d+)/)?.[1]
  return number ? `Campus Photo ${number}` : base.replace(/[-_]/g, ' ')
}

function defaultAlt(filename) {
  return `Galaxy English School — ${defaultCaption(filename)}`
}

export async function loadGalleryPhotos() {
  if (cachedPhotos) return cachedPhotos

  const entries = Object.entries(photoModules).filter(([path]) => {
    const filename = getFilename(path)
    return !GALLERY_EXCLUDE.has(filename)
  })

  const photos = await Promise.all(
    entries.map(async ([path, loader]) => {
      const src = await loader()
      const filename = getFilename(path)
      const overrides = photoCaptions[filename] ?? {}

      return {
        id: filename,
        src,
        filename,
        caption: overrides.caption ?? defaultCaption(filename),
        alt: overrides.alt ?? defaultAlt(filename),
      }
    }),
  )

  cachedPhotos = photos.sort((a, b) =>
    a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }),
  )

  return cachedPhotos
}
