import { useEffect, useRef } from 'react'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

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
  const questionLocked = selected != null
  const isVisual = question.visualType === 'visual' || question.visualType === 'fraction' || question.visualType === 'reading' || question.display || question.shapes || question.passage
  const hasIcons = question.options.some((opt) => opt.icon)
  const advanceTimer = useRef(null)

  const goNext = () => {
    if (currentIndex < total - 1) onIndexChange(currentIndex + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) onIndexChange(currentIndex - 1)
  }

  const handleSelect = (questionId, optionId) => {
    if (answers[questionId] != null) return

    onAnswer(questionId, optionId)

    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => {
      if (currentIndex < total - 1) {
        onIndexChange(currentIndex + 1)
      } else {
        onComplete?.()
      }
    }, 650)
  }

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
  }, [])

  useEffect(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
  }, [currentIndex])

  return (
    <div className="quiz">
      <div className="quiz__progress-wrap">
        <div className="quiz__progress-meta">
          <span>Question {currentIndex + 1} of {total}</span>
          <span>{answeredCount} answered</span>
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

        {questionLocked && (
          <p className="quiz__locked-note">Answer locked — cannot be changed.</p>
        )}

        <div
          className={[
            'quiz__options',
            hasIcons ? 'quiz__options--visual' : '',
            questionLocked ? 'quiz__options--locked' : '',
          ].filter(Boolean).join(' ')}
          role="listbox"
          aria-label="Answer options"
        >
          {question.options.map((option, index) => {
            const isSelected = selected === option.id
            const isCorrect = option.id === question.correctOptionId
            const showResult = isSelected

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
                  questionLocked && !isSelected ? 'quiz__option--disabled' : '',
                  showResult && isCorrect ? 'quiz__option--correct' : '',
                  showResult && !isCorrect ? 'quiz__option--wrong' : '',
                ].filter(Boolean).join(' ')}
                disabled={questionLocked}
                onClick={() => handleSelect(question.id, option.id)}
              >
                <span className="quiz__option-letter">{OPTION_LABELS[index]}</span>
                {option.icon && (
                  <span className="quiz__option-icon" aria-hidden="true">{option.icon}</span>
                )}
                <span className="quiz__option-text">{option.label}</span>
                {showResult && (
                  <span className="quiz__option-badge" aria-hidden="true">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
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
          ← Previous
        </button>

        <div className="quiz__dots" aria-hidden="true">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={[
                'quiz__dot',
                i === currentIndex ? 'quiz__dot--current' : '',
                answers[q.id] ? 'quiz__dot--answered' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onIndexChange(i)}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btn--primary"
          data-joy-tour="quiz-next"
          onClick={goNext}
          disabled={currentIndex === total - 1}
        >
          Next →
        </button>
      </div>

      <p className="quiz__hint">{assessment.instructions}</p>
    </div>
  )
}

export default AssessmentQuiz
