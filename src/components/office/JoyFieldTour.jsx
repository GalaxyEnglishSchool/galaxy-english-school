import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import joyStanding from '../../assets/joy-standing.png'
import './JoyFieldTour.css'

const FALLBACK_BUBBLE_STYLE = {
  top: 'auto',
  bottom: '6.5rem',
  right: '1.25rem',
  left: 'auto',
}

function JoyFieldTour({
  steps,
  title = 'Joy',
  showMap = false,
  contextStep = null,
  onClose,
  onVisibleChange,
}) {
  const visibleSteps = useMemo(
    () => steps.filter((step) => {
      if (step.requiresMap && !showMap) return false
      if (step.requiredStep != null && contextStep != null && step.requiredStep !== contextStep) {
        return false
      }
      return true
    }),
    [steps, showMap, contextStep],
  )

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    setStepIndex(0)
  }, [contextStep])

  const [bubbleStyle, setBubbleStyle] = useState(FALLBACK_BUBBLE_STYLE)

  const step = visibleSteps[stepIndex]
  const isLast = stepIndex >= visibleSteps.length - 1
  const canShowTour = Boolean(step && visibleSteps.length > 0)

  useEffect(() => {
    onVisibleChange?.(canShowTour)
  }, [canShowTour, onVisibleChange])

  const clearHighlights = useCallback(() => {
    document.querySelectorAll('.joy-tour-spotlight, .joy-tour-spotlight-secondary').forEach((node) => {
      node.classList.remove('joy-tour-spotlight', 'joy-tour-spotlight-secondary')
    })
  }, [])

  const updateSpotlight = useCallback(() => {
    clearHighlights()

    if (!step) {
      setBubbleStyle(FALLBACK_BUBBLE_STYLE)
      return
    }

    const target = document.querySelector(`[data-joy-tour="${step.target}"]`)
    if (!target) {
      setBubbleStyle(FALLBACK_BUBBLE_STYLE)
      return
    }

    target.classList.add('joy-tour-spotlight')
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

    if (step.secondaryTarget) {
      const secondary = document.querySelector(`[data-joy-tour="${step.secondaryTarget}"]`)
      secondary?.classList.add('joy-tour-spotlight-secondary')
    }

    const rect = target.getBoundingClientRect()
    const bubbleWidth = 300
    const left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - bubbleWidth - 12,
    )
    const top = Math.min(rect.bottom + 12, window.innerHeight - 180)

    setBubbleStyle({ top, left, bottom: 'auto', right: 'auto' })
  }, [step, clearHighlights])

  useEffect(() => {
    if (!canShowTour) return undefined

    const frame = window.requestAnimationFrame(updateSpotlight)
    window.addEventListener('resize', updateSpotlight)
    window.addEventListener('scroll', updateSpotlight, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateSpotlight)
      window.removeEventListener('scroll', updateSpotlight, true)
      clearHighlights()
    }
  }, [updateSpotlight, stepIndex, showMap, clearHighlights, canShowTour])

  if (!canShowTour) return null

  const goNext = () => {
    if (isLast) {
      onClose?.()
      return
    }
    setStepIndex((index) => Math.min(index + 1, visibleSteps.length - 1))
  }

  const goBack = () => {
    setStepIndex((index) => Math.max(index - 1, 0))
  }

  return createPortal(
    <div className="joy-tour" role="dialog" aria-label="Joy guided tour">
      <div className="joy-tour__backdrop" aria-hidden="true" />
      <div className="joy-tour__bubble" style={bubbleStyle}>
        <div className="joy-tour__bubble-head">
          <span className="joy-tour__avatar" aria-hidden="true">
            <img src={joyStanding} alt="" decoding="async" />
          </span>
          <div>
            <strong>{title}</strong>
            <span className="joy-tour__step-count">
              Step {stepIndex + 1} of {visibleSteps.length}
            </span>
          </div>
        </div>
        <p className="joy-tour__message">{step.message}</p>
        {step.example && (
          <p className="joy-tour__example">{step.example}</p>
        )}
        <div className="joy-tour__actions">
          {stepIndex > 0 && (
            <button type="button" className="joy-tour__btn joy-tour__btn--ghost" onClick={goBack}>
              Back
            </button>
          )}
          <button type="button" className="joy-tour__btn joy-tour__btn--skip" onClick={onClose}>
            Skip
          </button>
          <button
            type="button"
            className="joy-tour__btn joy-tour__btn--next joy-tour__btn--highlight"
            onClick={goNext}
          >
            {isLast ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default JoyFieldTour
