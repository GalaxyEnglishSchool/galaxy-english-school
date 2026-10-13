/**
 * Vector PDF (real text + tables) — not a screenshot.
 * Avoids html2canvas misalignment / blur on Download PDF.
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { academicYear } from '../data/admissionData'
import { busPaymentRules, schoolPaymentRules } from '../data/paymentRulesPrint'
import { contact, site } from '../data/siteData'
const MARGIN = 10
const PAGE_W = 210
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

function sectionBar(doc, title, y) {
  const top = y
  doc.setFillColor(...NAVY)
  doc.rect(MARGIN, top, CONTENT_W, SECTION_BAR_H, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(title.toUpperCase(), MARGIN + 2, top + SECTION_BAR_H - 2)
  doc.setTextColor(0, 0, 0)
  return top + SECTION_BAR_H + SECTION_BODY_GAP
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

function drawScoreBadge(doc, cx, cy, radius, percent, tone) {
  const ring = TONE_STYLE[tone]?.border ?? [30, 64, 175]
  doc.setDrawColor(...ring)
  doc.setLineWidth(1.4)
  doc.circle(cx, cy, radius, 'S')
  doc.setFillColor(255, 255, 255)
  doc.circle(cx, cy, Math.max(1, radius - 2.2), 'F')
  const p = Math.min(100, Math.max(0, Math.round(percent ?? 0)))
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...NAVY)
  doc.text(String(p), cx, cy + 0.8, { align: 'center' })
  doc.setFontSize(5.5)
  doc.setTextColor(107, 114, 128)
  doc.text('%', cx, cy + 4.2, { align: 'center' })
  doc.setTextColor(0, 0, 0)
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
  const badgeR = 8.5
  const badgeCx = MARGIN + badgeR + 1
  const badgeTop = y
  const badgeCy = badgeTop + badgeR + 1
  const colX = MARGIN + badgeR * 2 + 5
  const colW = CONTENT_W - (colX - MARGIN)

  drawScoreBadge(doc, badgeCx, badgeCy, badgeR, testScore.percent, tone)

  let textY = badgeTop + 3
  drawConditionTag(doc, colX, textY, admission.conditionLabel, tone)
  textY += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...NAVY)
  doc.text(formatTestScoreLine(testScore), colX, textY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(55, 65, 81)
  textY += 4.5
  doc.setFontSize(8.5)
  const summary = wrapLines(doc, admission.conditionSummary || '', colW)
  doc.text(summary, colX, textY)
  textY += summary.length * 3.6

  y = Math.max(badgeCy + badgeR + 3, textY + 2)

  if (admission.scholarshipPercent > 0) {
    y = ensureSpace(doc, y, 14)
    const scholText = `${admission.scholarshipLabel} — ${admission.scholarshipPercent}% off annual tuition`
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    const bodyLines = wrapLines(doc, scholText, CONTENT_W - 8)
    const boxH = bodyLines.length * 3.4 + 7
    doc.setFillColor(239, 246, 255)
    doc.setDrawColor(147, 197, 253)
    doc.setLineWidth(0.3)
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 1.5, 1.5, 'FD')
    doc.setTextColor(30, 64, 175)
    doc.text('Scholarship', MARGIN + 3, y + 4.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 58, 138)
    doc.text(bodyLines, MARGIN + 3, y + 8.5)
    doc.setTextColor(0, 0, 0)
    y += boxH + 3
  }

  const strengths = admission.strongPoints || []
  const weak = admission.weakPoints || []
  if (strengths.length || weak.length) {
    y = ensureSpace(doc, y, 28)
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: 'grid',
      styles: { fontSize: 7.75, cellPadding: 2.2, valign: 'top', lineColor: [229, 231, 235] },
      head: [
        [
          { content: 'Strengths', styles: { fillColor: [236, 253, 245], textColor: [4, 120, 87], fontStyle: 'bold' } },
          { content: 'To improve', styles: { fillColor: [255, 251, 235], textColor: [146, 64, 14], fontStyle: 'bold' } },
        ],
      ],
      body: [[bulletBlock(strengths), bulletBlock(weak)]],
      columnStyles: {
        0: { cellWidth: CONTENT_W / 2 },
        1: { cellWidth: CONTENT_W / 2 },
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
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
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
    y = sectionBar(doc, 'Student information', y)
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1.8, valign: 'middle' },
      headStyles: { fillColor: [243, 244, 246], textColor: 55, fontStyle: 'bold' },
      body: [
        [
          { content: 'Student', styles: { fontStyle: 'bold' } },
          feeReport.student?.name || '—',
          { content: 'Class', styles: { fontStyle: 'bold' } },
          feeReport.gradeLabel || '—',
        ],
        [
          { content: 'Parent', styles: { fontStyle: 'bold' } },
          feeReport.student?.parentName || '—',
          { content: 'Phone', styles: { fontStyle: 'bold' } },
          feeReport.student?.parentPhone || '—',
        ],
      ],
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 58 },
        2: { cellWidth: 22 },
        3: { cellWidth: 58 },
      },
    })
    y = doc.lastAutoTable.finalY + 4
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
    const feeRows = [
      ['Annual tuition', formatINRForPdf(feeReport.tuition)],
    ]
    if (!isWalkIn && feeReport.scholarshipPercent > 0) {
      feeRows.push([
        `Scholarship (${feeReport.scholarshipPercent}%)`,
        `- ${formatINRForPdf(feeReport.scholarshipAmount)}`,
      ])
    }
    if (!isWalkIn && feeReport.siblingDiscount) {
      feeRows.push(['Sibling discount', `- ${formatINRForPdf(feeReport.siblingAmount)}`])
    }
    if (!isWalkIn && (feeReport.scholarshipPercent > 0 || feeReport.siblingDiscount)) {
      feeRows.push(['Tuition payable', formatINRForPdf(feeReport.tuitionPayable)])
    }
    feeRows.push([
      'Admission fee (one-time)',
      feeReport.admissionFee > 0 ? formatINRForPdf(feeReport.admissionFee) : '—',
    ])
    feeRows.push(['Estimated 1st year total', formatINRForPdf(feeReport.firstYearTotal)])

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
        if (data.row.index === feeRows.length - 1) {
          data.cell.styles.fillColor = [239, 246, 255]
        }
      },
    })
    y = doc.lastAutoTable.finalY + 4
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

  y = ensureSpace(doc, y, 12)
  doc.setFontSize(7)
  doc.setTextColor(100, 100, 100)
  doc.text(
    'Estimate only — subject to school confirmation. Official receipt required for all payments.',
    MARGIN,
    doc.internal.pageSize.getHeight() - MARGIN,
  )
  doc.text(`${site.name} · ${contact.email}`, MARGIN, doc.internal.pageSize.getHeight() - MARGIN + 3.5)

  return { doc, fileName: resolvedFileName }
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
