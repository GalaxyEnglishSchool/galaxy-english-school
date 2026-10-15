import { useMemo, useRef, useState } from 'react'
import schoolLogo from '../../assets/school.png'
import { academicYear, gradeFees } from '../../data/admissionData'
import { busPaymentRules, parentDocumentChecklist, schoolPaymentRules } from '../../data/paymentRulesPrint'
import { buildPrintSchoolFeeRows } from '../../utils/buildPrintFeeRows'
import { contact, site } from '../../data/siteData'
import { formatINR } from '../../utils/formatCurrency'
import { sharePdfOnWhatsApp } from '../../utils/whatsapp'
import { useOfficeStudent } from '../../context/OfficeStudentContext'
import { buildWalkInAdmission } from '../../utils/buildWalkInAdmission'
import {
  buildParentSummaryPdfBlob,
  downloadParentSummaryPdf,
  pdfFileNameFromStudent,
} from '../../utils/parentSummaryPdf'
import './OfficePrintSummary.css'

function formatDate(iso) {
  if (!iso) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function scoreTone(percent) {
  if (percent == null || Number.isNaN(percent)) return 'mid'
  if (percent >= 80) return 'good'
  if (percent >= 60) return 'mid'
  return 'low'
}

function formatTestScore(admission) {
  const pct = admission?.scorePercent
  const earned = admission?.earnedMarks
  const total = admission?.totalMarks
  if (earned != null && total != null && total > 0) {
    return { label: `${earned}/${total}`, percent: pct ?? Math.round((earned / total) * 100) }
  }
  if (pct != null) return { label: `${pct}%`, percent: pct }
  return { label: '—', percent: 0 }
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

function ScoreChip({ percent, tone }) {
  const p = Math.min(100, Math.max(0, Math.round(percent ?? 0)))
  return (
    <div
      className={`office-print__score-chip office-print__score-chip--${tone}`}
      aria-label={`Score ${p} percent`}
    >
      {p}%
    </div>
  )
}

function OfficePrintSummary({ onOpenTool }) {
  const sheetRef = useRef(null)
  const {
    admission,
    walkIn,
    bus,
    updatedAt,
    hasAdmission,
    hasWalkIn,
    hasBus,
    setWalkIn,
    clearPacket,
  } = useOfficeStudent()

  const [reportMode, setReportMode] = useState(hasWalkIn ? 'walkin' : 'session')
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [walkInForm, setWalkInForm] = useState({
    studentName: walkIn?.student?.name ?? '',
    parentName: walkIn?.student?.parentName ?? '',
    parentPhone: walkIn?.student?.parentPhone ?? '',
    gradeId: walkIn?.student?.gradeId ?? 'std1',
  })
  const [walkInEditorOpen, setWalkInEditorOpen] = useState(() => !walkIn)

  const isWalkIn = reportMode === 'walkin' && Boolean(walkIn)
  const feeReport = isWalkIn ? walkIn : admission
  const hasSchoolFees = Boolean(feeReport)
  const showAssessmentBlock = hasAdmission && !isWalkIn

  const studentName = feeReport?.student?.name || '—'
  const printDate = formatDate(updatedAt)
  const testScore = showAssessmentBlock ? formatTestScore(admission) : { label: '—', percent: 0 }
  const tone = scoreTone(testScore.percent)

  const displayBus = useMemo(() => {
    if (!hasBus) return null
    if (isWalkIn) {
      return {
        ...bus,
        siblingDiscount: false,
        monthlyTotal: bus.monthlyBeforeDiscount ?? bus.slabMonthly ?? bus.monthlyTotal,
        busSiblingDiscount: 0,
      }
    }
    return bus
  }, [bus, hasBus, isWalkIn])

  const canExport = hasSchoolFees || hasBus

  const applyWalkInReport = () => {
    const built = buildWalkInAdmission(walkInForm)
    if (!built) {
      setPdfError('Enter student name and class for classwise fees.')
      return
    }
    setPdfError('')
    setWalkIn(built)
    setReportMode('walkin')
    setWalkInEditorOpen(false)
  }

  const handlePrint = () => {
    document.body.classList.add('office-print-mode')
    sheetRef.current?.style.removeProperty('--print-scale')
    window.print()
    window.setTimeout(() => {
      document.body.classList.remove('office-print-mode')
    }, 500)
  }

  const pdfExportPayload = () => ({
    logoUrl: schoolLogo,
    fileName: pdfFileNameFromStudent(feeReport?.student?.name),
    printDate,
    isWalkIn,
    feeReport: hasSchoolFees ? feeReport : null,
    showAssessmentBlock,
    admission: showAssessmentBlock ? admission : null,
    testScore,
    displayBus,
  })

  const handleDownloadPdf = async () => {
    if (!canExport) return
    setPdfBusy(true)
    setPdfError('')
    try {
      await downloadParentSummaryPdf(pdfExportPayload())
    } catch (err) {
      setPdfError(err?.message || 'Could not create PDF. Try Print instead.')
    } finally {
      setPdfBusy(false)
    }
  }

  const sendWhatsAppPdf = async () => {
    if (!canExport) return
    setPdfBusy(true)
    setPdfError('')
    try {
      const { blob, fileName } = await buildParentSummaryPdfBlob(pdfExportPayload())
      const summaryKind = isWalkIn
        ? 'classwise fee summary (no assessment)'
        : 'admission & fee summary'
      const classLine = feeReport?.gradeLabel ? ` (${feeReport.gradeLabel})` : ''
      const message = `Hello from ${site.name}. Please find the ${summaryKind} PDF for ${studentName}${classLine}. Date: ${printDate}.`
      await sharePdfOnWhatsApp({
        blob,
        fileName,
        message,
        parentPhone: feeReport?.student?.parentPhone,
      })
    } catch (err) {
      setPdfError(err?.message || 'Could not share PDF on WhatsApp.')
    } finally {
      setPdfBusy(false)
    }
  }

  const handleClear = () => {
    if (!window.confirm('Clear assessment, classwise fees, and bus data for this session?')) return
    clearPacket()
    setReportMode('session')
    setWalkInEditorOpen(true)
    setWalkInForm({
      studentName: '',
      parentName: '',
      parentPhone: '',
      gradeId: 'std1',
    })
  }

  return (
    <div className="office-print">
      <div className="office-card office-print__toolbar">
        <header className="office-print__toolbar-head">
          <div className="office-print__toolbar-intro">
            <h3>Print / PDF summary</h3>
          </div>
          <div className="office-print__mode-tabs" role="tablist" aria-label="Report type">
            <button
              type="button"
              role="tab"
              aria-selected={reportMode === 'session'}
              className={`office-print__mode-tab${reportMode === 'session' ? ' office-print__mode-tab--active' : ''}`}
              onClick={() => setReportMode('session')}
            >
              From assessment
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={reportMode === 'walkin'}
              className={`office-print__mode-tab${reportMode === 'walkin' ? ' office-print__mode-tab--active' : ''}`}
              onClick={() => {
                setReportMode('walkin')
                setWalkInEditorOpen(true)
              }}
            >
              Classwise fees (no assessment)
            </button>
          </div>
        </header>

        {reportMode === 'walkin' && walkInEditorOpen && (
          <div className="office-print__walkin-card">
            <h4>Classwise fees without assessment — no test, no discounts</h4>
            <div className="office-print__walkin-grid">
              <label>
                Student name
                <input
                  type="text"
                  value={walkInForm.studentName}
                  onChange={(e) => setWalkInForm((f) => ({ ...f, studentName: e.target.value }))}
                  placeholder="Child's full name"
                />
              </label>
              <label>
                Class
                <select
                  value={walkInForm.gradeId}
                  onChange={(e) => setWalkInForm((f) => ({ ...f, gradeId: e.target.value }))}
                >
                  {gradeFees.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Parent name
                <input
                  type="text"
                  value={walkInForm.parentName}
                  onChange={(e) => setWalkInForm((f) => ({ ...f, parentName: e.target.value }))}
                />
              </label>
              <label>
                Phone / WhatsApp
                <input
                  type="tel"
                  value={walkInForm.parentPhone}
                  onChange={(e) => setWalkInForm((f) => ({ ...f, parentPhone: e.target.value }))}
                />
              </label>
            </div>
            <button type="button" className="btn btn--primary" onClick={applyWalkInReport}>
              Update preview with classwise fees
            </button>
          </div>
        )}

        <div className="office-print__toolbar-panel">
          <div className="office-print__toolbar-row office-print__toolbar-row--status">
            <span className="office-print__toolbar-label">Session data</span>
            <div className="office-print__status">
              <span className={hasAdmission ? 'office-print__pill office-print__pill--ok' : 'office-print__pill'}>
                {hasAdmission ? 'Assessment in session' : 'No assessment'}
              </span>
              <span className={hasWalkIn ? 'office-print__pill office-print__pill--ok' : 'office-print__pill'}>
                {hasWalkIn ? 'Classwise fees ready' : 'Classwise fees not set'}
              </span>
              <span className={hasBus ? 'office-print__pill office-print__pill--ok' : 'office-print__pill'}>
                {hasBus ? 'Bus quote saved' : 'Bus optional'}
              </span>
            </div>
          </div>

          {((reportMode === 'session' && !hasAdmission) || !hasBus) && (
            <div className="office-print__toolbar-row office-print__toolbar-row--links">
              <span className="office-print__toolbar-label">Next step</span>
              <div className="office-print__link-actions">
                {reportMode === 'session' && !hasAdmission && (
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => onOpenTool('admission')}>
                    Go to Assessment
                  </button>
                )}
                {!hasBus && (
                  <button type="button" className="btn btn--secondary btn--sm" onClick={() => onOpenTool('bus')}>
                    Go to Bus fees
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="office-print__toolbar-row office-print__toolbar-row--actions">
            <span className="office-print__toolbar-label">Export</span>
            <div className="office-print__export-actions">
              <button
                type="button"
                className="btn btn--primary"
                disabled={!canExport || pdfBusy}
                onClick={handleDownloadPdf}
              >
                {pdfBusy ? 'Creating PDF…' : 'Download PDF'}
              </button>
              <button type="button" className="btn btn--secondary" disabled={!canExport} onClick={handlePrint}>
                Print
              </button>
              <button
                type="button"
                className="btn btn--whatsapp"
                disabled={!canExport || pdfBusy}
                onClick={sendWhatsAppPdf}
              >
                {pdfBusy ? 'Preparing PDF…' : 'Share PDF on WhatsApp'}
              </button>
            </div>
            <button type="button" className="btn btn--outline btn--sm office-print__clear" onClick={handleClear}>
              Clear session data
            </button>
          </div>
        </div>

        {pdfError && <p className="office-print__pdf-error" role="alert">{pdfError}</p>}
      </div>

      <article ref={sheetRef} className="office-print__sheet" aria-label="A4 summary preview">
        <div className="office-print__sheet-body">
        <header className="office-print__masthead">
          <img
            src={schoolLogo}
            alt=""
            className="office-print__logo"
            width={46}
            height={46}
            decoding="sync"
          />
          <div className="office-print__masthead-text">
            <h1>{site.name}</h1>
            <p>
              {site.board} · {site.grades}
              <br />
              {contact.address} · UDISE {site.udiseNumber} · {contact.phone}
            </p>
          </div>
          <aside className="office-print__masthead-ref">
            <span>{isWalkIn ? 'Classwise fees' : 'Fee summary'}</span>
            <strong>{academicYear}</strong>
            <span>{printDate}</span>
            {feeReport?.applicationId && <code>{feeReport.applicationId}</code>}
          </aside>
        </header>

        {!hasSchoolFees && (
          <section className="office-print__panel--empty">
            <p>
              {reportMode === 'walkin'
                ? 'Fill student details above and tap Update preview with classwise fees.'
                : 'Complete assessment or use Classwise fees without assessment.'}
            </p>
          </section>
        )}

        {hasSchoolFees && (
          <section className="office-print__section office-print__section--student">
            <h2 className="office-print__section-title office-print__section-title--compact">
              Student information
            </h2>
            <div className="office-print__section-body">
              <div className="office-print__student-compact">
                <p>
                  <span className="office-print__student-label">Student</span>
                  <span className="office-print__student-value">{studentName}</span>
                  <span className="office-print__student-label office-print__student-label--right">
                    Class
                  </span>
                  <span className="office-print__student-value">{feeReport?.gradeLabel || '—'}</span>
                </p>
                <p>
                  <span className="office-print__student-label">Parent</span>
                  <span className="office-print__student-value">
                    {feeReport?.student?.parentName || '—'}
                  </span>
                  <span className="office-print__student-label office-print__student-label--right">
                    Phone
                  </span>
                  <span className="office-print__student-value">
                    {feeReport?.student?.parentPhone || '—'}
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

        {showAssessmentBlock && (
          <section className="office-print__section">
            <h2 className="office-print__section-title">Admission assessment</h2>
            <div className="office-print__section-body">
              <div className="office-print__assess-top">
                <div className="office-print__assess-score">
                  <ScoreChip percent={testScore.percent} tone={tone} />
                </div>
                <p className="office-print__assess-summary">{admission.conditionSummary}</p>
                <div className={`office-print__assess-corner office-print__assess-corner--${tone}`}>
                  <span className={`office-print__tag office-print__tag--${tone}`}>
                    {admission.conditionLabel}
                  </span>
                  <p className="office-print__score-line">
                    <strong>{formatTestScoreLine(testScore)}</strong>
                  </p>
                  {admission.scholarshipPercent > 0 && (
                    <p className="office-print__assess-scholarship">
                      {admission.scholarshipLabel} · {admission.scholarshipPercent}% off tuition
                    </p>
                  )}
                </div>
              </div>
              {(admission.strongPoints?.length > 0 || admission.weakPoints?.length > 0) && (
                <div className="office-print__dual-lists office-print__dual-lists--assess">
                  <div className="office-print__assess-col office-print__assess-col--strengths">
                    <h4>Strengths</h4>
                    <ul>
                      {(admission.strongPoints?.length
                        ? admission.strongPoints
                        : ['—']
                      ).map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="office-print__assess-col office-print__assess-col--improve">
                    <h4>To improve</h4>
                    <ul>
                      {(admission.weakPoints?.length ? admission.weakPoints : ['—']).map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {isWalkIn && hasSchoolFees && (
          <section className="office-print__section">
            <h2 className="office-print__section-title">Classwise fees without assessment</h2>
            <div className="office-print__section-body office-print__assess-text">
              <span className="office-print__tag office-print__tag--walkin">{feeReport.conditionLabel}</span>
              <p>{feeReport.conditionSummary}</p>
            </div>
          </section>
        )}

        {hasSchoolFees && (
          <section className="office-print__section">
            <h2 className="office-print__section-title">School fees ({academicYear})</h2>
            <div className="office-print__section-body">
              {renderFeeTable(feeReport, isWalkIn)}
              <div className="office-print__doc-checklist-wrap">
                <h3 className="office-print__doc-checklist-title">Documents from parents (please submit)</h3>
                <ul className="office-print__doc-checklist">
                  {parentDocumentChecklist.map((item) => (
                    <li key={item}>
                      <span className="office-print__doc-checkbox" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {displayBus && (
          <section className="office-print__section">
            <h2 className="office-print__section-title">Bus facility</h2>
            <div className="office-print__section-body">
              <table className="office-print__data-table office-print__data-table--bus office-print__data-table--bus-grid">
                <tbody>
                  <tr>
                    <th>Monthly fee</th>
                    <td>{formatINR(displayBus.monthlyTotal)}</td>
                    <th>Trips per day</th>
                    <td>{displayBus.tripLabel}</td>
                  </tr>
                  <tr>
                    <th>Distance</th>
                    <td>
                      {displayBus.distanceKm} km · slab {displayBus.feeSlabLabel}
                    </td>
                    <th>Pickup point</th>
                    <td>{displayBus.destination}</td>
                  </tr>
                </tbody>
              </table>
              {isWalkIn && (
                <p className="office-print__bus-note">No sibling discount on classwise fee sheet.</p>
              )}
            </div>
          </section>
        )}

        {hasSchoolFees && (
          <section className="office-print__section">
            <h2 className="office-print__section-title">Payment rules &amp; conditions</h2>
            <div className="office-print__section-body">
              <div
                className={`office-print__rules-grid${
                  displayBus ? '' : ' office-print__rules-grid--single'
                }`}
              >
                <div>
                  <h4>School fees</h4>
                  <ol>
                    {schoolPaymentRules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ol>
                </div>
                {displayBus && (
                  <div>
                    <h4>Bus (if opted)</h4>
                    <ol>
                      {busPaymentRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        </div>

        <footer className="office-print__footer">
          <div className="office-print__signatures" aria-label="Signatures">
            <div className="office-print__signature">
              <span className="office-print__signature-line" />
              <span>Signature of assigned teacher</span>
            </div>
            <div className="office-print__signature">
              <span className="office-print__signature-line" />
              <span>Signature of parent(s)</span>
            </div>
          </div>
          {hasSchoolFees && (
            <div className="office-print__page-disclaimer">
              <p>Estimate only — subject to school confirmation. Official receipt required for all payments.</p>
              <p>{site.name} · {contact.email}</p>
            </div>
          )}
        </footer>
      </article>
    </div>
  )
}

function renderFeeTable(feeReport, walkInOnly) {
  const { rows } = buildPrintSchoolFeeRows(feeReport, walkInOnly, formatINR)
  return (
    <table className="office-print__data-table office-print__data-table--amount">
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.label}
            className={row.isTotal ? 'office-print__row-total' : undefined}
          >
            <th>{row.label}</th>
            <td>{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OfficePrintSummary
