import { useMemo, useState } from 'react'
import {
  academicYear,
  admissionDiscounts,
  getScholarshipForScore,
  gradeFees,
} from '../../data/admissionData'
import { getAssessmentForGrade, getQuizScore } from '../../data/assessmentQuestions'
import { getStudentAssessmentReport } from '../../utils/assessmentReport'
import { formatINR } from '../../utils/formatCurrency'
import { openWhatsApp } from '../../utils/whatsapp'
import { contact, site } from '../../data/siteData'
import AssessmentQuiz from './AssessmentQuiz'
import OfficeStepBar from './OfficeStepBar'
import ProgressIcon from './ProgressIcon'

const ADMISSION_STEPS = ['Details', 'Test', 'Report']

const SECTION_ICONS = {
  'Reading (Marathi)': '📖',
  'Reading (English)': '📚',
  Maths: '🔢',
  English: '🔤',
  Science: '🔬',
  EVS: '🌍',
  GK: '💡',
  Colours: '🎨',
  Animals: '🐾',
  Numbers: '🔢',
  Counting: '🔢',
  Letters: '🔠',
  Shapes: '⬛',
  Listening: '👂',
  Speaking: '🗣️',
  Geography: '🗺️',
  History: '📜',
  Rhymes: '🎵',
  Body: '🧒',
  Sounds: '🔊',
}

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
  const [siblingDiscount, setSiblingDiscount] = useState(false)
  const [student, setStudent] = useState({
    name: '',
    dob: '',
    gradeId: 'std1',
    parentName: '',
    parentPhone: '',
  })

  const selectedGrade = gradeFees.find((g) => g.id === student.gradeId)
  const assessment = getAssessmentForGrade(student.gradeId)
  const questions = assessment.questions

  const { earnedMarks, totalMarks, percent } = useMemo(
    () => getQuizScore(questions, answers),
    [questions, answers],
  )

  const studentReport = useMemo(
    () => getStudentAssessmentReport(questions, answers),
    [questions, answers],
  )

  const scholarship = getScholarshipForScore(percent)

  const feeSummary = useMemo(() => {
    const tuition = selectedGrade?.annualTuition ?? 0
    const admissionFee = selectedGrade?.admissionFee ?? 0

    const scholarshipAmount = Math.round((tuition * scholarship.scholarshipPercent) / 100)
    const afterScholarship = tuition - scholarshipAmount

    const siblingAmount = siblingDiscount
      ? Math.round((afterScholarship * admissionDiscounts.siblingPercent) / 100)
      : 0
    const tuitionPayable = afterScholarship - siblingAmount

    return {
      tuition,
      admissionFee,
      scholarshipAmount,
      siblingAmount,
      tuitionPayable,
      firstYearTotal: tuitionPayable + admissionFee,
    }
  }, [selectedGrade, scholarship, siblingDiscount])

  const handleAnswer = (questionId, optionId) => {
    setAnswers((prev) => {
      if (prev[questionId] != null) return prev
      return { ...prev, [questionId]: optionId }
    })
  }

  const handleStudentChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }))
    if (field === 'gradeId') {
      setAnswers({})
      setQuestionIndex(0)
    }
  }

  const startAssessment = () => {
    setApplicationId(createApplicationId())
    setQuestionIndex(0)
    setAnswers({})
    setSiblingDiscount(false)
    setStep(2)
  }

  const resetForm = () => {
    setStep(1)
    setApplicationId('')
    setQuestionIndex(0)
    setAnswers({})
    setSiblingDiscount(false)
    setStudent({
      name: '',
      dob: '',
      gradeId: 'std1',
      parentName: '',
      parentPhone: '',
    })
  }

  const sendWhatsAppReport = () => {
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    const strongText = studentReport.strongPoints.map((p) => `✓ ${p}`).join('\n') || '—'
    const weakText = studentReport.weakPoints.map((p) => `• ${p}`).join('\n') || '—'
    const readingMr = studentReport.readingSummary?.marathi
    const readingEn = studentReport.readingSummary?.english
    const readingText = [
      readingMr ? `Marathi reading: ${readingMr.correct}/${readingMr.total}` : '',
      readingEn ? `English reading: ${readingEn.correct}/${readingEn.total}` : '',
    ].filter(Boolean).join('\n')

    const discountLines = [
      siblingDiscount ? `• Sibling discount: -${formatINR(feeSummary.siblingAmount)} (${admissionDiscounts.siblingPercent}%)` : '',
    ].filter(Boolean).join('\n')

    const message = `🎓 ${site.name} — Admission Report

Student: ${student.name}
Class: ${selectedGrade?.label}
Date: ${date}
Ref: ${applicationId}

Test Score: ${earnedMarks}/${totalMarks} (${percent}%)
Overall: ${studentReport.conditionLabel}

💪 Strong points:
${strongText}

📌 Areas to improve:
${weakText}

📖 Reading:
${readingText || '—'}

Scholarship (test-based): ${scholarship.label} — ${scholarship.scholarshipPercent}%

Fee Summary (${academicYear}):
• Annual tuition: ${formatINR(feeSummary.tuition)}
• Scholarship: -${formatINR(feeSummary.scholarshipAmount)} (${scholarship.scholarshipPercent}%)
${discountLines}
• Tuition payable: ${formatINR(feeSummary.tuitionPayable)}
• Admission fee (one-time): ${feeSummary.admissionFee > 0 ? formatINR(feeSummary.admissionFee) : 'Not applicable'}
• Est. 1st year total: ${formatINR(feeSummary.firstYearTotal)}

Parent: ${student.parentName}
Phone: ${student.parentPhone}

${site.name}, ${site.location}
📞 ${contact.phone}`

    openWhatsApp(message)
  }

  const progressTone = (value) => {
    if (value >= 80) return 'good'
    if (value >= 60) return 'mid'
    return 'low'
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
            Test for <strong>{selectedGrade?.label}</strong>: {questions.length} questions
            (includes Marathi &amp; English reading)
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
            onComplete={() => setStep(3)}
          />

          <div className="office-card__actions">
            <button type="button" className="btn btn--secondary" onClick={() => setStep(1)}>
              Back to details
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="office-card office-card--report">
          <header className="admission-report__header">
            <div>
              <span className="admission-report__badge">Admission Report</span>
              <h3>{student.name}</h3>
              <p>
                {selectedGrade?.label} · {applicationId} · {academicYear}
              </p>
            </div>
            <ProgressIcon
              icon="🎯"
              label="Overall score"
              percent={percent}
              sublabel={`${earnedMarks}/${totalMarks}`}
              tone={progressTone(percent)}
            />
          </header>

          {/* Assessment report */}
          <section className="admission-report__section">
            <h4 className="admission-report__section-title">
              <span aria-hidden="true">📊</span> Student assessment
            </h4>
            <p className="admission-report__condition">
              <strong>{studentReport.conditionLabel}</strong> — {studentReport.conditionSummary}
            </p>

            <div className="admission-report__progress-grid">
              {studentReport.sections.map((section) => (
                <ProgressIcon
                  key={section.name}
                  icon={SECTION_ICONS[section.name] ?? '📝'}
                  label={section.name}
                  percent={section.percent}
                  sublabel={`${section.correct}/${section.total}`}
                  tone={progressTone(section.percent)}
                />
              ))}
            </div>

            <div className="admission-report__insights">
              <div className="admission-report__insight admission-report__insight--strong">
                <h5>💪 Strong points</h5>
                <ul>
                  {(studentReport.strongPoints.length
                    ? studentReport.strongPoints
                    : ['Keeps trying — encourage regular practice']
                  ).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="admission-report__insight admission-report__insight--weak">
                <h5>📌 Weak points</h5>
                <ul>
                  {(studentReport.weakPoints.length
                    ? studentReport.weakPoints
                    : ['No major weak areas identified']
                  ).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Scholarship — fixed from test */}
          <section className="admission-report__section admission-report__scholarship">
            <h4 className="admission-report__section-title">
              <span aria-hidden="true">🏆</span> Scholarship (from test score)
            </h4>
            <div className="admission-report__scholarship-card">
              <ProgressIcon
                icon="⭐"
                label={scholarship.label}
                percent={scholarship.scholarshipPercent}
                sublabel={`Score ${percent}% → ${scholarship.scholarshipPercent}% off tuition`}
                tone={scholarship.scholarshipPercent > 0 ? 'good' : 'mid'}
              />
              <p className="admission-report__scholarship-note">
                Scholarship is calculated automatically from the test. It cannot be changed manually.
              </p>
            </div>
          </section>

          {/* Fee calculation */}
          <section className="admission-report__section admission-report__fees">
            <h4 className="admission-report__section-title">
              <span aria-hidden="true">💰</span> Fee calculation
            </h4>

            <div className="admission-fee__toggles">
              <button
                type="button"
                className={`bus-toggle${siblingDiscount ? ' bus-toggle--on' : ''}`}
                onClick={() => setSiblingDiscount((v) => !v)}
                aria-pressed={siblingDiscount}
              >
                <span className="bus-toggle__track"><span className="bus-toggle__thumb" /></span>
                <span>Sibling discount ({admissionDiscounts.siblingPercent}%)</span>
              </button>
            </div>

            <div className="admission-fee__card">
              <div className="admission-fee__total">
                <span>Estimated 1st year total</span>
                <strong>{formatINR(feeSummary.firstYearTotal)}</strong>
              </div>

              <ul className="admission-fee__lines">
                <li>
                  <span>Annual tuition ({academicYear})</span>
                  <strong>{formatINR(feeSummary.tuition)}</strong>
                </li>
                <li className="admission-fee__lines--discount">
                  <span>Scholarship — {scholarship.label} ({scholarship.scholarshipPercent}%)</span>
                  <strong>- {formatINR(feeSummary.scholarshipAmount)}</strong>
                </li>
                {siblingDiscount && (
                  <li className="admission-fee__lines--discount">
                    <span>Sibling discount ({admissionDiscounts.siblingPercent}%)</span>
                    <strong>- {formatINR(feeSummary.siblingAmount)}</strong>
                  </li>
                )}
                <li className="admission-fee__lines--highlight">
                  <span>Tuition payable</span>
                  <strong>{formatINR(feeSummary.tuitionPayable)}</strong>
                </li>
                <li>
                  <span>Admission fee (one-time)</span>
                  <strong>
                    {feeSummary.admissionFee > 0 ? formatINR(feeSummary.admissionFee) : '—'}
                  </strong>
                </li>
              </ul>
            </div>

            <p className="office-disclaimer">
              Scholarship and discounts apply to annual tuition only. Bus, uniform, and other charges are separate.
            </p>
          </section>

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
