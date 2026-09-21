import { photoCaptions } from '../data/siteData'

// Auto-detects every image in src/assets/ that starts with "Photo"
// e.g. Photo1.jpg, Photo2.jpg, Photo123.png — add files, no code changes needed
const photoModules = import.meta.glob(
  '../assets/Photo*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

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

export function loadGalleryPhotos() {
  return Object.entries(photoModules)
    .map(([path, src]) => {
      const filename = getFilename(path)
      const overrides = photoCaptions[filename] ?? {}

      return {
        id: filename,
        src,
        filename,
        caption: overrides.caption ?? defaultCaption(filename),
        alt: overrides.alt ?? defaultAlt(filename),
      }
    })
    .sort((a, b) =>
      a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' }),
    )
}

export function getPhotoAt(index) {
  return loadGalleryPhotos()[index] ?? null
}
