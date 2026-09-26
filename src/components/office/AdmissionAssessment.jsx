import { useMemo, useState } from 'react'
import {
  academicYear,
  getScholarshipForScore,
  gradeFees,
} from '../../data/admissionData'
import { getAssessmentForGrade, getQuizScore } from '../../data/assessmentQuestions'
import { formatINR } from '../../utils/formatCurrency'
import { openWhatsApp } from '../../utils/whatsapp'
import { contact, site } from '../../data/siteData'
import AssessmentQuiz from './AssessmentQuiz'
import OfficeStepBar from './OfficeStepBar'

const ADMISSION_STEPS = ['Details', 'Test', 'Report']

const SCHOLARSHIP_OPTIONS = [
  { scholarshipPercent: 0, label: 'Standard Admission' },
  { scholarshipPercent: 10, label: 'Galaxy Encouragement' },
  { scholarshipPercent: 20, label: 'Galaxy Merit' },
  { scholarshipPercent: 30, label: 'Galaxy Star' },
]

function createApplicationId() {
  const year = new Date().getFullYear()
  const serial = Math.floor(1000 + Math.random() * 9000)
  return `GES-${year}-${serial}`
}

function AdmissionAssessment() {
  const [step, setStep] = useState(1)
  const [applicationId, setApplicationId] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [student, setStudent] = useState({
    name: '',
    dob: '',
    gradeId: 'std1',
    parentName: '',
    parentPhone: '',
  })
  const [scholarshipOverride, setScholarshipOverride] = useState(null)

  const selectedGrade = gradeFees.find((g) => g.id === student.gradeId)
  const assessment = getAssessmentForGrade(student.gradeId)
  const questions = assessment.questions

  const { earnedMarks, totalMarks, percent } = useMemo(
    () => getQuizScore(questions, answers),
    [questions, answers],
  )

  const suggestedScholarship = getScholarshipForScore(percent)
  const activeScholarship = scholarshipOverride ?? suggestedScholarship

  const feeSummary = useMemo(() => {
    const tuition = selectedGrade?.annualTuition ?? 0
    const admissionFee = selectedGrade?.admissionFee ?? 0
    const scholarshipAmount = Math.round((tuition * activeScholarship.scholarshipPercent) / 100)
    const tuitionAfterScholarship = tuition - scholarshipAmount
    return {
      tuition,
      admissionFee,
      scholarshipAmount,
      tuitionAfterScholarship,
      firstYearTotal: tuitionAfterScholarship + admissionFee,
    }
  }, [selectedGrade, activeScholarship])

  const allAnswered = useMemo(
    () => questions.every((q) => answers[q.id] != null),
    [answers, questions],
  )

  const handleAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    setScholarshipOverride(null)
  }

  const handleStudentChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }))
    if (field === 'gradeId') {
      setAnswers({})
      setQuestionIndex(0)
      setScholarshipOverride(null)
    }
  }

  const startAssessment = () => {
    setApplicationId(createApplicationId())
    setQuestionIndex(0)
    setAnswers({})
    setStep(2)
  }

  const resetForm = () => {
    setStep(1)
    setApplicationId('')
    setQuestionIndex(0)
    setAnswers({})
    setStudent({
      name: '',
      dob: '',
      gradeId: 'std1',
      parentName: '',
      parentPhone: '',
    })
    setScholarshipOverride(null)
  }

  const sendWhatsAppReport = () => {
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    const message = `🎓 ${site.name} — Admission Report

Student: ${student.name}
Class: ${selectedGrade?.label}
Date: ${date}
Ref: ${applicationId}

Test Score: ${earnedMarks}/${totalMarks} (${percent}%)
Scholarship: ${activeScholarship.label} — ${activeScholarship.scholarshipPercent}% on annual tuition

Fee Summary (${academicYear}):
• Annual tuition: ${formatINR(feeSummary.tuition)}
• Scholarship: -${formatINR(feeSummary.scholarshipAmount)} (${activeScholarship.scholarshipPercent}%)
• Tuition payable: ${formatINR(feeSummary.tuitionAfterScholarship)}
• Admission fee (one-time): ${feeSummary.admissionFee > 0 ? formatINR(feeSummary.admissionFee) : 'Not applicable'}
• Est. 1st year total: ${formatINR(feeSummary.firstYearTotal)}

Parent: ${student.parentName}
Phone: ${student.parentPhone}

Next step: Visit office with birth certificate & documents to complete admission.

${site.name}, ${site.location}
📞 ${contact.phone}`

    openWhatsApp(message)
  }

  return (
    <div className="office-panel">
      <OfficeStepBar steps={ADMISSION_STEPS} currentStep={step} />

      {step === 1 && (
        <div className="office-card">
          <h3>Student & parent details</h3>
          <div className="office-form-grid">
            <label>
              Student name
              <input
                type="text"
                value={student.name}
                onChange={(e) => handleStudentChange('name', e.target.value)}
                placeholder="Child's full name"
                required
              />
            </label>
            <label>
              Date of birth
              <input
                type="date"
                value={student.dob}
                onChange={(e) => handleStudentChange('dob', e.target.value)}
              />
            </label>
            <label>
              Applying for
              <select
                value={student.gradeId}
                onChange={(e) => handleStudentChange('gradeId', e.target.value)}
              >
                {gradeFees.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.label}</option>
                ))}
              </select>
            </label>
            <label>
              Parent / guardian name
              <input
                type="text"
                value={student.parentName}
                onChange={(e) => handleStudentChange('parentName', e.target.value)}
                placeholder="Parent name"
              />
            </label>
            <label className="office-form-grid__full">
              Parent WhatsApp number
              <input
                type="tel"
                value={student.parentPhone}
                onChange={(e) => handleStudentChange('parentPhone', e.target.value)}
                placeholder="10-digit mobile number"
              />
            </label>
          </div>
          <p className="office-card__meta">
            Test for <strong>{selectedGrade?.label}</strong>: {questions.length} easy MCQ questions
          </p>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!student.name.trim()}
            onClick={startAssessment}
          >
            Start Admission Test
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="office-card office-card--quiz">
          <div className="office-card__header">
            <div>
              <h3>{assessment.title}</h3>
              <p className="office-card__meta">Application ID: <strong>{applicationId}</strong></p>
            </div>
            <div className="office-score-pill">
              Score: <strong>{earnedMarks}/{totalMarks}</strong> ({percent}%)
            </div>
          </div>

          <AssessmentQuiz
            assessment={assessment}
            answers={answers}
            onAnswer={handleAnswer}
            currentIndex={questionIndex}
            onIndexChange={setQuestionIndex}
          />

          <div className="office-card__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn--primary"
              disabled={!allAnswered}
              onClick={() => setStep(3)}
            >
              {allAnswered
                ? 'View Fees & Report'
                : `Answer all ${questions.length} questions`}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="office-card">
          <div className="office-card__header">
            <div>
              <h3>Fee calculation & report</h3>
              <p className="office-card__meta">
                {student.name} · {selectedGrade?.label} · {applicationId}
              </p>
            </div>
          </div>

          <div className="office-result-banner">
            <div>
              <span className="office-result-banner__label">Test score</span>
              <strong>{earnedMarks} / {totalMarks} ({percent}%)</strong>
            </div>
            <div>
              <span className="office-result-banner__label">Suggested scholarship</span>
              <strong>{suggestedScholarship.label} — {suggestedScholarship.scholarshipPercent}%</strong>
            </div>
          </div>

          <div className="office-form-grid office-form-grid--compact">
            <label>
              Scholarship tier
              <select
                value={activeScholarship.scholarshipPercent}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  const tier = SCHOLARSHIP_OPTIONS.find((t) => t.scholarshipPercent === value)
                  setScholarshipOverride(tier)
                }}
              >
                {SCHOLARSHIP_OPTIONS.map((tier) => (
                  <option key={tier.scholarshipPercent} value={tier.scholarshipPercent}>
                    {tier.label} — {tier.scholarshipPercent}%
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="office-fee-table">
            <div className="office-fee-row">
              <span>Annual tuition ({academicYear})</span>
              <span>{formatINR(feeSummary.tuition)}</span>
            </div>
            <div className="office-fee-row office-fee-row--discount">
              <span>Scholarship ({activeScholarship.scholarshipPercent}%)</span>
              <span>- {formatINR(feeSummary.scholarshipAmount)}</span>
            </div>
            <div className="office-fee-row office-fee-row--highlight">
              <span>Tuition after scholarship</span>
              <span>{formatINR(feeSummary.tuitionAfterScholarship)}</span>
            </div>
            <div className="office-fee-row">
              <span>Admission fee (one-time)</span>
              <span>
                {feeSummary.admissionFee > 0 ? formatINR(feeSummary.admissionFee) : '—'}
              </span>
            </div>
            <div className="office-fee-row office-fee-row--total">
              <span>Estimated 1st year total</span>
              <span>{formatINR(feeSummary.firstYearTotal)}</span>
            </div>
          </div>

          <p className="office-disclaimer">
            Scholarship applies to tuition only. Bus, uniform, and other charges are calculated separately.
          </p>

          <div className="office-card__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button type="button" className="btn btn--whatsapp" onClick={sendWhatsAppReport}>
              Send Report on WhatsApp
            </button>
            <button type="button" className="btn btn--primary" onClick={resetForm}>
              New Admission
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdmissionAssessment
