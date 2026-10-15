import {
  admissionProcessFees,
  estimateFirstYearTotal,
  formatProcessFeeAmount,
} from '../data/paymentRulesPrint'

/**
 * @param {object} feeReport
 * @param {boolean} walkInOnly
 * @param {(n: number) => string} formatAmount
 * @returns {{ rows: { label: string, amount: string, isTotal?: boolean }[], yearTotal: number }}
 */
export function buildPrintSchoolFeeRows(feeReport, walkInOnly, formatAmount) {
  if (!feeReport) return { rows: [], yearTotal: 0 }

  const rows = [{ label: 'Annual tuition', amount: formatAmount(feeReport.tuition) }]

  if (!walkInOnly && feeReport.scholarshipPercent > 0) {
    rows.push({
      label: `Scholarship (${feeReport.scholarshipPercent}%)`,
      amount: `- ${formatAmount(feeReport.scholarshipAmount)}`,
    })
  }
  if (!walkInOnly && feeReport.siblingDiscount) {
    rows.push({
      label: 'Sibling discount',
      amount: `- ${formatAmount(feeReport.siblingAmount)}`,
    })
  }
  if (
    !walkInOnly &&
    (feeReport.scholarshipPercent > 0 || feeReport.siblingDiscount)
  ) {
    rows.push({
      label: 'Tuition payable',
      amount: formatAmount(feeReport.tuitionPayable),
    })
  }

  rows.push({
    label: 'Admission fee (one-time)',
    amount: feeReport.admissionFee > 0 ? formatAmount(feeReport.admissionFee) : '—',
  })

  admissionProcessFees.forEach((fee) => {
    rows.push({
      label: fee.label,
      amount: formatProcessFeeAmount(fee.amount, formatAmount),
    })
  })

  const yearTotal = estimateFirstYearTotal(feeReport, walkInOnly)
  rows.push({
    label: 'Estimated 1st year total',
    amount: formatAmount(yearTotal),
    isTotal: true,
  })

  return { rows, yearTotal }
}
