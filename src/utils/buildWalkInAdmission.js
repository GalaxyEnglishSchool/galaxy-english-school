import { gradeFees } from '../data/admissionData'

export function buildWalkInAdmission({ studentName, parentName, parentPhone, gradeId }) {
  const name = studentName?.trim()
  if (!name) return null

  const grade = gradeFees.find((g) => g.id === gradeId)
  if (!grade) return null

  const tuition = grade.annualTuition ?? 0
  const admissionFee = grade.admissionFee ?? 0
  const year = new Date().getFullYear()
  const serial = Math.floor(1000 + Math.random() * 9000)

  return {
    walkIn: true,
    student: {
      name,
      parentName: parentName?.trim() ?? '',
      parentPhone: parentPhone?.trim() ?? '',
      gradeId,
    },
    applicationId: `GES-WALKIN-${year}-${serial}`,
    gradeLabel: grade.label,
    conditionLabel: 'Classwise fees without assessment',
    conditionSummary:
      'Fee estimate by class only — no placement test, scholarship, or discounts on this sheet.',
    scorePercent: null,
    earnedMarks: null,
    totalMarks: null,
    scholarshipLabel: 'None',
    scholarshipPercent: 0,
    siblingDiscount: false,
    tuition,
    scholarshipAmount: 0,
    siblingAmount: 0,
    tuitionPayable: tuition,
    admissionFee,
    firstYearTotal: tuition + admissionFee,
    strongPoints: [],
    weakPoints: [],
  }
}
