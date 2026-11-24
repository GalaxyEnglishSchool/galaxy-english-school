/**
 * Crop UPI QR codes from full payment-card JPEGs into office PDF assets.
 *
 * Workflow (src/assets/office):
 * - Edit school-fees-qr-full.jpg and bus-fees-qr-full.jpg (full Paytm / UPI cards).
 * - Run: node .agent-scripts/crop-office-qr.mjs
 * - Outputs school-fees-qr.jpg and bus-fees-qr.jpg (used by Office PDF).
 *
 * If you already have a tight QR crop, save it directly as school-fees-qr.jpg or
 * bus-fees-qr.jpg — no need to run this script.
 */
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '..')
const officeAssets = path.join(repo, 'src/assets/office')

const sources = [
  {
    name: 'school',
    file: path.join(officeAssets, 'school-fees-qr-full.jpg'),
    out: path.join(officeAssets, 'school-fees-qr.jpg'),
    /** Paytm card — QR sits in white panel below Paytm/UPI header */
    cropPct: { left: 0.24, top: 0.44, width: 0.52, height: 0.3 },
  },
  {
    name: 'bus',
    file: path.join(officeAssets, 'bus-fees-qr-full.jpg'),
    out: path.join(officeAssets, 'bus-fees-qr.jpg'),
    /** Gray card — QR in central white box */
    cropPct: { left: 0.22, top: 0.28, width: 0.56, height: 0.46 },
  },
]

async function cropOne({ name, file, out, cropPct }) {
  const input = file
  const meta = await sharp(input).metadata()
  const left = Math.round(meta.width * cropPct.left)
  const top = Math.round(meta.height * cropPct.top)
  const width = Math.round(meta.width * cropPct.width)
  const height = Math.round(meta.height * cropPct.height)
  const size = Math.min(width, height)
  const extract = {
    left,
    top,
    width: size,
    height: size,
  }
  await sharp(input)
    .extract(extract)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(out)
  console.log(`${name}: ${meta.width}x${meta.height} -> extract`, extract, '->', out)
}

for (const item of sources) {
  await cropOne(item)
}