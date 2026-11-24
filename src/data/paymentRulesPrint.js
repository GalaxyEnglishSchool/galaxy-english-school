/** Shown on parent PDF / print summary. */

/** One-time fees at admission (edit amounts here). */
export const admissionProcessFees = [
  { label: 'ID card & diary fees', amount: 350 },
  { label: 'Nirgam form processing fees', amount: 350 },
]

export const parentDocumentChecklist = [
  'TC / LC (Transfer / Leaving Certificate) — Xerox copy',
  'Birth certificate — Xerox copy',
  'Aadhaar card — Xerox copy',
  'Xerox copies — 5 sets',
  'Passport-size student photographs — 5',
]

export function sumAdmissionProcessFees() {
  return admissionProcessFees.reduce((total, row) => total + (row.amount ?? 0), 0)
}

/** Estimated 1st year including tuition, admission fee, and process fees below. */
export function estimateFirstYearTotal(feeReport, walkInOnly) {
  if (!feeReport) return 0
  const tuitionPart = walkInOnly
    ? feeReport.tuition ?? 0
    : feeReport.tuitionPayable ?? feeReport.tuition ?? 0
  return tuitionPart + (feeReport.admissionFee ?? 0) + sumAdmissionProcessFees()
}

export function formatProcessFeeAmount(amount, formatFn) {
  if (amount == null || amount === 0) return '—'
  return formatFn(amount)
}

/** Page 2 — tuition payment choice (blank schedule for office to fill). */
export const schoolInstallmentSectionTitle = 'One-time or installment (max 3 per year)'

export const schoolInstallmentIntro =
  'Pay the full year in one payment, or in up to 3 installments. School office will note due dates and amounts below.'

export const schoolInstallmentTableHeaders = ['Installment', 'Due date', 'Amount (Rs.)']

/** Blank rows — dates and amounts filled by office at admission. */
export const schoolInstallmentScheduleRows = [
  { id: '1', label: '1st installment' },
  { id: '2', label: '2nd installment' },
  { id: '3', label: '3rd installment' },
]

export const schoolInstallmentOneTimeRow = { id: 'one-time', label: 'One-time (full year)' }

export const schoolInstallmentLateFeeNote =
  'If not paid by the due date, late fee Rs. 100/- per month applies until payment is received.'

export function schoolInstallmentTableBody() {
  return [
  [schoolInstallmentOneTimeRow.label, '', ''],
  ...schoolInstallmentScheduleRows.map((row) => [row.label, '', '']),
  ]
}

export const schoolPaymentRules = [
  'School fees should be paid before the half-year deadline communicated by the office.',
  'If payment is not received by the due date, late fee Rs. 100/- per month applies.',
  'A valid payment receipt from the school office is mandatory — parents must collect and keep it.',
]

/** Page 2 — after UPI QR — parent ethics & compliance (edit text here). */
export const parentEthicsSectionTitle = 'Parents — ethics & compliance'

export const parentEthicsRules = [
  'Parents and guardians must follow school policies, circulars, and ethical conduct as notified by the management.',
  'Every parent is requested to take their child\'s report home and review it with the student.',
  'The school is responsible for the wellbeing and development of your child, but it is equal responsibility of the parent to take care and guide the child at home.',
  'If parents disrespect teachers or any concerned staff of the school, legal action will be taken against them.',
  'Parents must cooperate with the school on attendance, discipline, fees, safety, and all matters as per school rules.',
]

export const busPaymentRules = [
  'If bus facility is opted, bus fees are collected in advance for 3 months at a time.',
  'Bus fees run on a yearly cycle from June to June.',
  'The original monthly fee will increase by Rs. 200/- per month every new session (June), over the previous year\'s fee.',
  'Fees are subject to further change if petrol/diesel prices rise, as decided by the school.',
  'If the fee for any month is not paid within that month, a late fine of Rs. 100/- per month will be charged on the decided fees. This fine will not be reduced or waived under any circumstances.',
]