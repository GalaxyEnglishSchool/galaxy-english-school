import { photoCaptions } from '../data/siteData'

// Lazy-load campus photos so they are not fetched on first paint.
const photoModules = import.meta.glob(
  [
    '../assets/Photo*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
    '../assets/SchoolBus.{jpg,jpeg,JPG,JPEG}',
  ],
  { import: 'default' },
)

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

  const photos = await Promise.all(
    Object.entries(photoModules).map(async ([path, loader]) => {
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
