const OPTION_LABELS = ['A', 'B', 'C', 'D']

function AssessmentQuiz({ assessment, answers, onAnswer, currentIndex, onIndexChange }) {
  const questions = assessment.questions
  const question = questions[currentIndex]
  const total = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / total) * 100)
  const selected = answers[question.id]

  const goNext = () => {
    if (currentIndex < total - 1) onIndexChange(currentIndex + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) onIndexChange(currentIndex - 1)
  }

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

      <div className="quiz__section-tag">{question.section}</div>

      <div className="quiz__card">
        <p className="quiz__question">{question.question}</p>

        {question.display && (
          <div className="quiz__display" aria-hidden="true">{question.display}</div>
        )}

        {question.staffNote && (
          <p className="quiz__staff-note">💡 {question.staffNote}</p>
        )}

        <div className="quiz__options" role="listbox" aria-label="Answer options">
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
                  isSelected ? 'quiz__option--selected' : '',
                  showResult && isCorrect ? 'quiz__option--correct' : '',
                  showResult && !isCorrect ? 'quiz__option--wrong' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onAnswer(question.id, option.id)}
              >
                <span className="quiz__option-letter">{OPTION_LABELS[index]}</span>
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
