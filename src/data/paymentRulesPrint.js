/** Shown on parent PDF / print summary. */

/** One-time fees at admission (edit amounts here). */
export const admissionProcessFees = [
  { label: 'ID card & diary fees', amount: 350 },
  { label: 'Form filling process fees (as per Govt. rules)', amount: 350 },
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

export const schoolPaymentRules = [
  'School fees should be paid before the half-year deadline communicated by the office.',
  'Fees may be paid in a single payment or in up to 3 installments, as arranged with the school.',
  'A valid payment receipt from the school office is mandatory — parents must collect and keep it.',
]

export const busPaymentRules = [
  'If bus facility is opted, bus fees are collected in advance for 3 months at a time.',
  'Bus fees run on a yearly cycle from June to June.',
  'The original monthly fee will increase by Rs. 200/- per month every new session (June), over the previous year\'s fee.',
  'Fees are subject to further change if petrol/diesel prices rise, as decided by the school.',
  'If the fee for any month is not paid within that month, a late fine of Rs. 100/- per month will be charged on the decided fees. This fine will not be reduced or waived under any circumstances.',
]
