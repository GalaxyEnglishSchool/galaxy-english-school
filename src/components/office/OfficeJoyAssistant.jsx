import { useEffect, useRef, useState } from 'react'
import joyStanding from '../../assets/joy-standing.png'
import { officeJoyGreeting, officeJoyQuickPrompts } from '../../data/officeJoyData'
import { findJoyTopic, getJoyFallbackReply } from '../../utils/officeJoyChat'
import { JoyFieldSteps } from './OfficeJoyFieldGuide'
import './OfficeJoyAssistant.css'
import './OfficeJoyFieldGuide.css'

const PROMPT_ICONS = ['🗺️', '📋', '📝', '⭐']

function renderStepText(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
  )
}

function JoyReply({ reply, onOpenTool }) {
  const isFallback = Boolean(reply.isFallback)
  const hasFieldGuide = Array.isArray(reply.fieldSteps) && reply.fieldSteps.length > 0

  return (
    <div className="office-joy__reply">
      <p className="office-joy__reply-intro">
        {isFallback
          ? 'No worries — try one of these:'
          : hasFieldGuide
            ? 'Sure! Here\'s exactly where to click and what to enter:'
            : 'Happy to help! Here\'s what to do:'}
      </p>
      <p className="office-joy__reply-title">
        <span className="office-joy__reply-icon" aria-hidden="true">{reply.icon}</span>
        {reply.title ?? reply.question}
      </p>
      {hasFieldGuide ? (
        <JoyFieldSteps steps={reply.fieldSteps} />
      ) : (
        <ol className="office-joy__steps">
          {(reply.steps ?? []).map((step) => (
            <li key={step}>{renderStepText(step)}</li>
          ))}
        </ol>
      )}
      {reply.tip && (
        <p className="office-joy__tip">
          <span className="office-joy__tip-icon" aria-hidden="true">💡</span>
          <span>{reply.tip}</span>
        </p>
      )}
      {reply.toolId && onOpenTool && (
        <button
          type="button"
          className="office-joy__tool-link"
          onClick={() => onOpenTool(reply.toolId)}
        >
          Open {reply.toolLabel}
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}

function OfficeJoyAssistant({ onOpenTool }) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'joy',
      text: officeJoyGreeting,
    },
  ])
  const chatEndRef = useRef(null)
  const typingTimerRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => () => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
  }, [])

  const askJoy = (question) => {
    const trimmed = question.trim()
    if (!trimmed || isTyping) return

    const topic = findJoyTopic(trimmed)
    const reply = topic
      ? { ...topic, title: topic.question }
      : getJoyFallbackReply()

    const userId = `user-${Date.now()}`
    const joyId = `joy-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text: trimmed },
    ])
    setInput('')
    setIsTyping(true)

    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: joyId, role: 'joy', reply },
      ])
    }, 550)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    askJoy(input)
  }

  return (
    <div className="office-panel office-joy">
      <div className="office-joy__shell">
        <header className="office-joy__header">
          <div className="office-joy__avatar-wrap">
            <div className="office-joy__avatar" aria-hidden="true">
              <img src={joyStanding} alt="" />
            </div>
            <span className="office-joy__status" title="Online">Online</span>
          </div>
          <div className="office-joy__intro">
            <div className="office-joy__title-row">
              <h3>Joy</h3>
              <span className="office-joy__badge">Office helper</span>
            </div>
            <p>Ask me about admission, fees, bus, documents — I&apos;m here for you!</p>
          </div>
        </header>

        <div className="office-joy__chat" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`office-joy__message office-joy__message--${message.role}`}
            >
              {message.role === 'joy' && (
                <div className="office-joy__message-avatar" aria-hidden="true">
                  <img src={joyStanding} alt="" />
                </div>
              )}
              <div className="office-joy__message-col">
                {message.role === 'joy' && (
                  <span className="office-joy__message-name">Joy</span>
                )}
                <div className="office-joy__message-body">
                  {message.text && (
                    <p className="office-joy__message-text">{message.text}</p>
                  )}
                  {message.reply && (
                    <JoyReply reply={message.reply} onOpenTool={onOpenTool} />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="office-joy__message office-joy__message--joy office-joy__message--typing">
              <div className="office-joy__message-avatar" aria-hidden="true">
                <img src={joyStanding} alt="" />
              </div>
              <div className="office-joy__message-col">
                <span className="office-joy__message-name">Joy</span>
                <div className="office-joy__typing" aria-label="Joy is typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <footer className="office-joy__footer">
          <p className="office-joy__prompts-label">Quick questions</p>
          <div className="office-joy__prompts">
            {officeJoyQuickPrompts.map((prompt, index) => (
              <button
                key={prompt}
                type="button"
                className="office-joy__prompt"
                onClick={() => askJoy(prompt)}
                disabled={isTyping}
              >
                <span aria-hidden="true">{PROMPT_ICONS[index] ?? '💬'}</span>
                {prompt}
              </button>
            ))}
          </div>

          <form className="office-joy__form" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="office-joy-input">
              Ask Joy a question
            </label>
            <div className="office-joy__input-wrap">
              <input
                id="office-joy-input"
                type="text"
                className="office-joy__input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question here…"
                autoComplete="off"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="office-joy__send"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <span aria-hidden="true">➤</span>
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  )
}

export default OfficeJoyAssistant
