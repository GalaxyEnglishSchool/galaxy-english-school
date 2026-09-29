import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const assetsDir = join(process.cwd(), 'src', 'assets')
const imageExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'])

const rules = [
  { match: /^(Photo|Photos|SchoolBus|Allin1frame|Elearning)/i, maxWidth: 1600, quality: 78 },
  { match: /^(school|joy-standing|Showwebsite)/i, maxWidth: 512, quality: 80 },
]

function getRule(filename) {
  return rules.find((rule) => rule.match.test(filename)) ?? { maxWidth: 1400, quality: 78 }
}

async function optimizeFile(filePath, filename) {
  const { maxWidth, quality } = getRule(filename)
  const ext = extname(filename).toLowerCase()
  const input = sharp(filePath)
  const metadata = await input.metadata()

  if ((metadata.width ?? 0) <= maxWidth && (await stat(filePath)).size < 300_000) {
    return { filename, skipped: true }
  }

  const pipeline = input.rotate().resize({
    width: maxWidth,
    withoutEnlargement: true,
  })

  if (ext === '.png') {
    await pipeline.png({ quality, compressionLevel: 9 }).toFile(`${filePath}.tmp`)
  } else {
    await pipeline.jpeg({ quality, mozjpeg: true }).toFile(`${filePath}.tmp`)
  }

  const { rename, unlink } = await import('node:fs/promises')
  await unlink(filePath)
  await rename(`${filePath}.tmp`, filePath)

  const after = await stat(filePath)
  return { filename, skipped: false, sizeKB: Math.round(after.size / 1024) }
}

const files = await readdir(assetsDir)
const results = []

for (const filename of files) {
  if (!imageExt.has(extname(filename))) continue
  if (filename.includes('ChatGPT') || filename === 'Photo1.jpg') continue

  const filePath = join(assetsDir, filename)
  results.push(await optimizeFile(filePath, filename))
}

console.log('Optimized assets:')
for (const result of results) {
  if (result.skipped) {
    console.log(`  skip  ${result.filename}`)
  } else {
    console.log(`  done  ${result.filename} → ${result.sizeKB} KB`)
  }
}
