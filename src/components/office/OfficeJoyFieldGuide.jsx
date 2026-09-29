import { useState } from 'react'
import joyStanding from '../../assets/joy-standing.png'
import { officeJoyTopics } from '../../data/officeJoyData'
import './OfficeJoyFieldGuide.css'

export function getOfficeJoyTopic(topicId) {
  return officeJoyTopics.find((topic) => topic.id === topicId)
}

function renderStepText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
  )
}

export function JoyFieldSteps({ steps }) {
  if (!steps?.length) return null

  return (
    <ol className="office-joy__field-guide">
      {steps.map((item, index) => (
        <li key={`${item.field}-${index}`} className="office-joy__field-step">
          <span className="office-joy__field-num">{index + 1}</span>
          <div className="office-joy__field-body">
            <div className="office-joy__field-tags">
              <span className="office-joy__field-tag office-joy__field-tag--where">
                {item.where}
              </span>
              <span className="office-joy__field-tag office-joy__field-tag--field">
                {item.field}
              </span>
            </div>
            <p>{renderStepText(item.instruction)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function OfficeJoyFieldGuide({ topicId, defaultOpen = true }) {
  const topic = getOfficeJoyTopic(topicId)
  const [isOpen, setIsOpen] = useState(defaultOpen)

  if (!topic?.fieldSteps?.length) return null

  return (
    <aside className="office-joy-inline" aria-label="Joy step-by-step guide">
      <button
        type="button"
        className="office-joy-inline__toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="office-joy-inline__avatar" aria-hidden="true">
          <img src={joyStanding} alt="" />
        </span>
        <span className="office-joy-inline__toggle-text">
          <strong>Joy&apos;s guide</strong>
          <small>{topic.shortLabel} — where to click &amp; what to enter</small>
        </span>
        <span className="office-joy-inline__chevron" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="office-joy-inline__body">
          <p className="office-joy-inline__lead">{topic.question}</p>
          <JoyFieldSteps steps={topic.fieldSteps} />
          {topic.tip && (
            <p className="office-joy-inline__tip">
              <span aria-hidden="true">💡</span> {topic.tip}
            </p>
          )}
        </div>
      )}
    </aside>
  )
}

export default OfficeJoyFieldGuide
