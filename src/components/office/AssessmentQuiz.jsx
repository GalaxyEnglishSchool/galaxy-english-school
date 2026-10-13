import { useEffect, useRef } from 'react'

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const AUTO_ADVANCE_MS = 450

function ShapeDiagram({ shapes }) {
  if (!shapes?.length) return null

  return (
    <div className="quiz__shapes" aria-hidden="true">
      {shapes.map((shape, index) => (
        <span key={`${shape}-${index}`} className={`quiz__shape quiz__shape--${shape}`} />
      ))}
    </div>
  )
}

function AssessmentQuiz({ assessment, answers, onAnswer, currentIndex, onIndexChange, onComplete }) {
  const questions = assessment.questions
  const question = questions[currentIndex]
  const total = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / total) * 100)
  const selected = answers[question.id]
  const isVisual = question.visualType === 'visual' || question.visualType === 'fraction' || question.visualType === 'reading' || question.display || question.shapes || question.passage
  const hasIcons = question.options.some((opt) => opt.icon)
  const isLast = currentIndex >= total - 1
  const advanceTimer = useRef(null)
  const currentIndexRef = useRef(currentIndex)

  currentIndexRef.current = currentIndex

  const goNext = () => {
    if (currentIndex < total - 1) onIndexChange(currentIndex + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) onIndexChange(currentIndex - 1)
  }

  const scheduleAdvance = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => {
      const index = currentIndexRef.current
      if (index < total - 1) {
        onIndexChange(index + 1)
      } else {
        onComplete?.()
      }
    }, AUTO_ADVANCE_MS)
  }

  const handleSelect = (questionId, optionId) => {
    onAnswer(questionId, optionId)
    scheduleAdvance()
  }

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
  }, [])

  useEffect(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
  }, [currentIndex])

  return (
    <div className="quiz quiz--simple">
      <div className="quiz__progress-wrap">
        <div className="quiz__progress-meta">
          <span>Question {currentIndex + 1} / {total}</span>
          <span>{progress}% done</span>
        </div>
        <div className="quiz__progress-bar" aria-hidden="true">
          <div className="quiz__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={[
        'quiz__section-tag',
        question.passage ? 'quiz__section-tag--reading' : '',
      ].filter(Boolean).join(' ')}>
        {question.section}
      </div>

      <div className={['quiz__card', isVisual ? 'quiz__card--visual' : ''].filter(Boolean).join(' ')}>
        {question.passage && (
          <div
            className={[
              'quiz__passage',
              question.passageLang === 'mr' ? 'quiz__passage--marathi' : 'quiz__passage--english',
            ].join(' ')}
          >
            <span className="quiz__passage-label">
              {question.passageLang === 'mr' ? '📖 वाचन — मराठी' : '📖 Reading — English'}
            </span>
            <p className="quiz__passage-text">{question.passage}</p>
          </div>
        )}

        <p className="quiz__question">{question.question}</p>

        {question.shapes && <ShapeDiagram shapes={question.shapes} />}

        {question.display && (
          <div
            className={[
              'quiz__display',
              question.visualType === 'fraction' ? 'quiz__display--fraction' : '',
              isVisual ? 'quiz__display--animated' : '',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {question.display}
          </div>
        )}

        {question.staffNote && (
          <p className="quiz__staff-note">💡 {question.staffNote}</p>
        )}

        <div
          className={[
            'quiz__options',
            hasIcons ? 'quiz__options--visual' : '',
            'quiz__options--simple',
          ].filter(Boolean).join(' ')}
          role="listbox"
          aria-label="Answer options"
        >
          {question.options.map((option, index) => {
            const isSelected = selected === option.id

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={[
                  'quiz__option',
                  option.icon ? 'quiz__option--picture' : '',
                  isSelected ? 'quiz__option--selected' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleSelect(question.id, option.id)}
              >
                <span className="quiz__option-letter">{OPTION_LABELS[index]}</span>
                {option.icon && (
                  <span className="quiz__option-icon" aria-hidden="true">{option.icon}</span>
                )}
                <span className="quiz__option-text">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="quiz__nav">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          ← Back
        </button>

        {isLast ? (
          <button
            type="button"
            className="btn btn--primary"
            data-joy-tour="quiz-next"
            onClick={() => onComplete?.()}
            disabled={!selected}
          >
            Finish test
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            data-joy-tour="quiz-next"
            onClick={goNext}
          >
            Next →
          </button>
        )}
      </div>

      <p className="quiz__hint">{assessment.instructions}</p>
    </div>
  )
}

export default AssessmentQuiz
