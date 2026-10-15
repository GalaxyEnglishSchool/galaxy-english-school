/**
 * Vector PDF (real text + tables) — not a screenshot.
 * Avoids html2canvas misalignment / blur on Download PDF.
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { academicYear } from '../data/admissionData'
import { busPaymentRules, parentDocumentChecklist, schoolPaymentRules } from '../data/paymentRulesPrint'
import { contact, site } from '../data/siteData'
import { buildPrintSchoolFeeRows } from './buildPrintFeeRows'

const MARGIN = 10
/** A4 portrait (mm) — PDF output is always this size. */
const PAGE_W = 210
const PAGE_H = 297
const CONTENT_W = PAGE_W - MARGIN * 2
const NAVY = [15, 39, 68]
/** Coloured title strip height (mm). */
const SECTION_BAR_H = 6
/** Gap below bar before body text/table (mm) — avoids overlap with bar (jsPDF y is text baseline). */
const SECTION_BODY_GAP = 5

function loadImageDataUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Could not load school logo for PDF.'))
    img.src = src
  })
}

function sectionBar(doc, title, y, { compact = false } = {}) {
  const top = y
  const barH = compact ? 4.5 : SECTION_BAR_H
  const gapAfter = compact ? 3.5 : SECTION_BODY_GAP
  doc.setFillColor(...NAVY)
  doc.rect(MARGIN, top, CONTENT_W, barH, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(compact ? 6.5 : 8)
  doc.setFont('helvetica', 'bold')
  doc.text(title.toUpperCase(), MARGIN + 2, top + barH - 1.5)
  doc.setTextColor(0, 0, 0)
  return top + barH + gapAfter
}

const PDF_DISCLAIMER =
  'Estimate only — subject to school confirmation. Official receipt required for all payments.'

function drawCenteredDisclaimerBlock(doc, y) {
  y += 2
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.25)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(100, 116, 139)
  const centerX = MARGIN + CONTENT_W / 2
  const lines = wrapLines(doc, PDF_DISCLAIMER, CONTENT_W - 8)
  lines.forEach((line) => {
    doc.text(line, centerX, y, { align: 'center' })
    y += 3.1
  })
  doc.text(`${site.name} · ${contact.email}`, centerX, y, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  return y + 5
}

function drawStudentInfoCompact(doc, y, feeReport) {
  y = sectionBar(doc, 'Student information', y, { compact: true })
  const mid = MARGIN + CONTENT_W / 2 + 4
  const valX = MARGIN + 17
  const midValX = mid + 11

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(55, 65, 81)
  doc.text('Student', MARGIN, y)
  doc.text('Class', mid, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 39, 68)
  doc.text(feeReport.student?.name || '—', valX, y)
  doc.text(feeReport.gradeLabel || '—', midValX, y)
  y += 4.5

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(55, 65, 81)
  doc.text('Parent', MARGIN, y)
  doc.text('Phone', mid, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 39, 68)
  doc.text(feeReport.student?.parentName || '—', valX, y)
  doc.text(feeReport.student?.parentPhone || '—', midValX, y)
  doc.setTextColor(0, 0, 0)

  return y + 4
}

function ensureSpace(doc, y, needMm) {
  const pageH = doc.internal.pageSize.getHeight()
  if (y + needMm > pageH - MARGIN) {
    doc.addPage()
    return MARGIN
  }
  return y
}

function wrapLines(doc, text, maxWidth) {
  return doc.splitTextToSize(text, maxWidth)
}

/** jsPDF Helvetica cannot render ₹ — use ASCII "Rs." for reliable PDF text. */
function formatINRForPdf(amount) {
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(n))
  if (n < 0) return `- Rs. ${formatted}`
  return `Rs. ${formatted}`
}

function formatTestScoreLine(testScore) {
  const label = String(testScore?.label ?? '—')
  const pct = testScore?.percent
  if (label.includes('/')) {
    return pct != null ? `Marks ${label} (${pct}%)` : `Marks ${label}`
  }
  if (pct != null) return `Score ${pct}%`
  return `Score ${label}`
}

function scoreTone(percent) {
  if (percent == null || Number.isNaN(percent)) return 'mid'
  if (percent >= 80) return 'good'
  if (percent >= 60) return 'mid'
  return 'low'
}

const TONE_STYLE = {
  good: { fill: [236, 253, 245], border: [5, 150, 105], text: [4, 120, 87] },
  mid: { fill: [255, 251, 235], border: [217, 119, 6], text: [146, 64, 14] },
  low: { fill: [254, 242, 242], border: [220, 38, 38], text: [185, 28, 28] },
}

/** Compact score label (replaces large circular badge). */
function drawScoreChip(doc, x, topY, percent, tone) {
  const style = TONE_STYLE[tone] ?? TONE_STYLE.mid
  const p = Math.min(100, Math.max(0, Math.round(percent ?? 0)))
  const chipW = 15
  const chipH = 8
  doc.setFillColor(...style.fill)
  doc.setDrawColor(...style.border)
  doc.setLineWidth(0.25)
  doc.roundedRect(x, topY, chipW, chipH, 1, 1, 'FD')
  doc.setFillColor(...style.border)
  doc.rect(x, topY, 1.1, chipH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.setTextColor(...NAVY)
  doc.text(`${p}%`, x + chipW / 2, topY + 5.6, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  return { w: chipW, h: chipH }
}

function drawConditionTag(doc, x, y, label, tone) {
  const style = TONE_STYLE[tone] ?? TONE_STYLE.mid
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  const text = String(label || '—')
  const padX = 2.5
  const tagW = doc.getTextWidth(text) + padX * 2
  const tagH = 5.5
  doc.setFillColor(...style.fill)
  doc.setDrawColor(...style.border)
  doc.setLineWidth(0.25)
  doc.roundedRect(x, y, tagW, tagH, 1.2, 1.2, 'FD')
  doc.setTextColor(...style.text)
  doc.text(text, x + padX, y + 3.9)
  doc.setTextColor(0, 0, 0)
  return { w: tagW, h: tagH }
}

function bulletBlock(items) {
  if (!items?.length) return '—'
  return items.map((item) => `• ${item}`).join('\n')
}

function drawAssessmentPanel(doc, y, admission, testScore) {
  const tone = scoreTone(testScore.percent)
  const bandTop = y
  const leftColW = 17
  const cornerW = 46
  const rightEdge = MARGIN + CONTENT_W
  const midX = MARGIN + leftColW
  const midW = CONTENT_W - leftColW - cornerW - 2

  const chip = drawScoreChip(doc, MARGIN, bandTop + 1, testScore.percent, tone)

  const style = TONE_STYLE[tone] ?? TONE_STYLE.mid
  let cornerY = bandTop + 3.5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...style.text)
  doc.text(String(admission.conditionLabel || '—'), rightEdge, cornerY, { align: 'right' })
  cornerY += 4.2
  doc.setFontSize(7.5)
  doc.setTextColor(...NAVY)
  doc.text(formatTestScoreLine(testScore), rightEdge, cornerY, { align: 'right' })
  cornerY += 3.8
  if (admission.scholarshipPercent > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.75)
    doc.setTextColor(30, 64, 175)
    const scholCorner = `${admission.scholarshipLabel} · ${admission.scholarshipPercent}% off`
    const scholLines = wrapLines(doc, scholCorner, cornerW)
    scholLines.forEach((line) => {
      doc.text(line, rightEdge, cornerY, { align: 'right' })
      cornerY += 3
    })
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.75)
  doc.setTextColor(55, 65, 81)
  const summary = wrapLines(doc, admission.conditionSummary || '', midW)
  doc.text(summary, midX, bandTop + 4)

  const summaryH = summary.length * 3.35
  y = Math.max(bandTop + 1 + chip.h + 3, bandTop + 4 + summaryH, cornerY + 2) + 2

  const strengths = admission.strongPoints || []
  const weak = admission.weakPoints || []
  if (strengths.length || weak.length) {
    y = ensureSpace(doc, y, 26)
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: 'grid',
      styles: { fontSize: 7.25, cellPadding: 2, valign: 'top', textColor: [31, 41, 55] },
      head: [
        [
          {
            content: 'Strengths',
            styles: { fillColor: [209, 250, 229], textColor: [4, 120, 87], fontStyle: 'bold', lineColor: [52, 211, 153] },
          },
          {
            content: 'To improve',
            styles: { fillColor: [254, 240, 138], textColor: [161, 98, 7], fontStyle: 'bold', lineColor: [250, 204, 21] },
          },
        ],
      ],
      body: [[bulletBlock(strengths), bulletBlock(weak)]],
      columnStyles: {
        0: { cellWidth: CONTENT_W / 2, fillColor: [236, 253, 245], lineColor: [52, 211, 153] },
        1: { cellWidth: CONTENT_W / 2, fillColor: [254, 252, 232], lineColor: [250, 204, 21] },
      },
    })
    y = doc.lastAutoTable.finalY + 4
  }

  return y
}

function busLabelCell(text) {
  return {
    content: text,
    styles: {
      fontStyle: 'bold',
      fillColor: [255, 251, 235],
      textColor: [120, 53, 15],
    },
  }
}

function drawBusPanel(doc, y, displayBus) {
  const labelW = 26
  const valueW = (CONTENT_W - labelW * 2) / 2
  const rows = [
    [
      busLabelCell('Monthly fee'),
      formatINRForPdf(displayBus.monthlyTotal),
      busLabelCell('Trips per day'),
      displayBus.tripLabel,
    ],
    [
      busLabelCell('Distance'),
      `${displayBus.distanceKm} km · slab ${displayBus.feeSlabLabel}`,
      busLabelCell('Pickup point'),
      displayBus.destination,
    ],
  ]
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.8, valign: 'middle', overflow: 'linebreak' },
    body: rows,
    columnStyles: {
      0: { cellWidth: labelW },
      1: { cellWidth: valueW, halign: 'left' },
      2: { cellWidth: labelW },
      3: { cellWidth: valueW, halign: 'left' },
    },
    didParseCell: (data) => {
      if (data.section !== 'body') return
      if (data.row.index === 0 && data.column.index === 1) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.textColor = [146, 64, 14]
      }
    },
  })
  return doc.lastAutoTable.finalY + 4
}

function drawDocumentsChecklist(doc, y) {
  y = ensureSpace(doc, y, 28)
  y = sectionBar(doc, 'Documents from parents (please submit)', y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(55, 65, 81)
  const box = 3.2
  const gap = 4.8
  parentDocumentChecklist.forEach((label) => {
    y = ensureSpace(doc, y, gap + 2)
    const top = y - 2.8
    doc.setDrawColor(120, 53, 15)
    doc.setLineWidth(0.35)
    doc.rect(MARGIN, top, box, box)
    const lines = wrapLines(doc, label, CONTENT_W - box - 4)
    doc.text(lines, MARGIN + box + 2.5, y)
    y += Math.max(gap, lines.length * 3.4)
  })
  doc.setTextColor(0, 0, 0)
  return y + 2
}

function pdfFileNameFromStudent(studentName) {
  const slug = (studentName || 'student')
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
  return `Galaxy-${slug || 'parent'}-summary.pdf`
}

/**
 * @param {object} opts
 * @param {string} opts.logoUrl - bundled logo URL from Vite import
 */
export async function buildParentSummaryPdf({
  logoUrl,
  fileName,
  printDate,
  isWalkIn,
  feeReport,
  showAssessmentBlock,
  admission,
  testScore,
  displayBus,
}) {
  if (!feeReport && !displayBus) {
    throw new Error('Nothing to export.')
  }

  const resolvedFileName = fileName || pdfFileNameFromStudent(feeReport?.student?.name)
  const doc = new jsPDF({
    unit: 'mm',
    format: [PAGE_W, PAGE_H],
    orientation: 'portrait',
    compress: true,
  })
  let y = MARGIN

  try {
    const logoData = await loadImageDataUrl(logoUrl)
    doc.addImage(logoData, 'PNG', MARGIN, y, 14, 14)
  } catch {
    // continue without logo
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(site.name, MARGIN + 17, y + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const headerLines = wrapLines(
    doc,
    `${site.board} · ${site.grades}\n${contact.address}\nUDISE ${site.udiseNumber} · ${contact.phone}`,
    CONTENT_W - 45,
  )
  doc.text(headerLines, MARGIN + 17, y + 9)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const refX = PAGE_W - MARGIN
  doc.text(isWalkIn ? 'Classwise fees' : 'Fee summary', refX, y + 4, { align: 'right' })
  doc.text(academicYear, refX, y + 9, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(printDate, refX, y + 13, { align: 'right' })
  if (feeReport?.applicationId) {
    doc.setFontSize(7)
    doc.text(feeReport.applicationId, refX, y + 17, { align: 'right' })
  }

  y += 20

  if (feeReport) {
    y = drawStudentInfoCompact(doc, y, feeReport)
  }

  if (showAssessmentBlock && admission) {
    y = ensureSpace(doc, y, 50)
    y = sectionBar(doc, 'Admission assessment', y)
    y = drawAssessmentPanel(doc, y, admission, testScore)
  }

  if (isWalkIn && feeReport) {
    y = ensureSpace(doc, y, 18)
    y = sectionBar(doc, 'Classwise fees without assessment', y)
    doc.setFontSize(9)
    const walk = wrapLines(doc, feeReport.conditionSummary || '', CONTENT_W)
    doc.text(walk, MARGIN, y)
    y += walk.length * 3.5 + 4
  }

  if (feeReport) {
    y = ensureSpace(doc, y, 40)
    y = sectionBar(doc, `School fees (${academicYear})`, y)
    const { rows: feeRowDefs } = buildPrintSchoolFeeRows(feeReport, isWalkIn, formatINRForPdf)
    const feeRows = feeRowDefs.map((row) => [row.label, row.amount])
    const totalRowIndex = feeRows.length - 1

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.8, overflow: 'linebreak' },
      head: [['Fee item', 'Amount']],
      headStyles: { fillColor: [243, 244, 246], textColor: 55, fontStyle: 'bold' },
      body: feeRows,
      columnStyles: {
        0: { cellWidth: CONTENT_W - 48, halign: 'left' },
        1: { cellWidth: 48, halign: 'right', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.row.index === totalRowIndex) {
          data.cell.styles.fillColor = [239, 246, 255]
        }
      },
    })
    y = doc.lastAutoTable.finalY + 4
    y = drawDocumentsChecklist(doc, y)
  }

  if (displayBus) {
    y = ensureSpace(doc, y, 32)
    y = sectionBar(doc, 'Bus facility', y)
    y = drawBusPanel(doc, y, displayBus)
  }

  if (feeReport) {
    y = ensureSpace(doc, y, 45)
    y = sectionBar(doc, 'Payment rules & conditions', y)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text('School fees', MARGIN, y)
    y += 3.5
    doc.setFont('helvetica', 'normal')
    schoolPaymentRules.forEach((rule, i) => {
      const lines = wrapLines(doc, `${i + 1}. ${rule}`, CONTENT_W - 4)
      y = ensureSpace(doc, y, lines.length * 3.2 + 1)
      doc.text(lines, MARGIN + 2, y)
      y += lines.length * 3.2 + 0.8
    })
    if (displayBus) {
      y += 2
      doc.setFont('helvetica', 'bold')
      doc.text('Bus (if opted)', MARGIN, y)
      y += 3.5
      doc.setFont('helvetica', 'normal')
      busPaymentRules.forEach((rule, i) => {
        const lines = wrapLines(doc, `${i + 1}. ${rule}`, CONTENT_W - 4)
        y = ensureSpace(doc, y, lines.length * 3.2 + 1)
        doc.text(lines, MARGIN + 2, y)
        y += lines.length * 3.2 + 0.8
      })
    }
  }

  y = drawDocumentFooter(doc, y, { showDisclaimer: Boolean(feeReport) })

  return { doc, fileName: resolvedFileName }
}

/** Signatures + disclaimer pinned to bottom of the page when there is room. */
function drawDocumentFooter(doc, contentY, { showDisclaimer = true } = {}) {
  const pageH = doc.internal.pageSize.getHeight()
  const blockH = showDisclaimer ? 38 : 22
  let y = contentY + 5

  if (y + blockH <= pageH - MARGIN) {
    const pinnedY = pageH - MARGIN - blockH
    if (y < pinnedY) y = pinnedY
  } else {
    y = ensureSpace(doc, y, blockH)
    const pageH2 = doc.internal.pageSize.getHeight()
    const pinnedY = pageH2 - MARGIN - blockH
    if (y < pinnedY) y = pinnedY
  }

  y = drawSignatureFooter(doc, y, { skipEnsure: true })
  if (showDisclaimer) drawCenteredDisclaimerBlock(doc, y)
  return y
}

function drawSignatureFooter(doc, y, { skipEnsure = false } = {}) {
  if (!skipEnsure) y = ensureSpace(doc, y, 28)
  const colW = (CONTENT_W - 12) / 2
  const leftX = MARGIN
  const rightX = MARGIN + colW + 12
  const lineY = y + 10

  doc.setDrawColor(75, 85, 99)
  doc.setLineWidth(0.35)
  doc.line(leftX, lineY, leftX + colW, lineY)
  doc.line(rightX, lineY, rightX + colW, lineY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(31, 41, 55)
  doc.text('Signature of assigned teacher', leftX + colW / 2, lineY + 4.5, { align: 'center' })
  doc.text('Signature of parent(s)', rightX + colW / 2, lineY + 4.5, { align: 'center' })

  return lineY + 14
}

export async function buildParentSummaryPdfBlob(opts) {
  const { doc, fileName } = await buildParentSummaryPdf(opts)
  return { blob: doc.output('blob'), fileName }
}

export async function downloadParentSummaryPdf(opts) {
  const { doc, fileName } = await buildParentSummaryPdf(opts)
  doc.save(fileName)
}

export { pdfFileNameFromStudent }
