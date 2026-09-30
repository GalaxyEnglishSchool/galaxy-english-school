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
  dockBubbleToCorner = false,
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
  const [bubbleDockMode, setBubbleDockMode] = useState(null)
  const [highlightStyle, setHighlightStyle] = useState(null)

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

  const applySpotlight = useCallback((target, secondaryTarget, tourStep) => {
    const isMobile = window.innerWidth <= 767
    const padding = isMobile ? 4 : 10
    const inset = isMobile ? 6 : 12
    const rect = target.getBoundingClientRect()
    const dockCorner = dockBubbleToCorner || Boolean(tourStep?.dockBubble)

    setHighlightStyle({
      top: rect.top - padding,
      left: Math.max(0, rect.left - padding),
      width: Math.min(window.innerWidth - inset, rect.width + padding * 2),
      height: rect.height + padding * 2,
    })

    if (isMobile) {
      const bubbleWidth = Math.min(188, window.innerWidth - 16)
      setBubbleDockMode('bottom')
      setBubbleStyle({
        bottom: '0.5rem',
        left: `${(window.innerWidth - bubbleWidth) / 2}px`,
        top: 'auto',
        right: 'auto',
      })
    } else if (dockCorner) {
      setBubbleDockMode('corner')
      setBubbleStyle({
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        right: 'max(1.25rem, env(safe-area-inset-right))',
        top: 'auto',
        left: 'auto',
      })
    } else {
      const bubbleWidth = Math.min(300, window.innerWidth - 20)
      const bubbleLeft = Math.min(
        Math.max(inset, rect.left),
        window.innerWidth - bubbleWidth - inset,
      )
      const belowTop = rect.bottom + 12
      const aboveTop = rect.top - 12 - 180
      const top = belowTop <= window.innerHeight - 160
        ? belowTop
        : Math.max(inset, aboveTop)

      setBubbleDockMode(null)
      setBubbleStyle({ top, left: bubbleLeft, bottom: 'auto', right: 'auto' })
    }

    if (secondaryTarget) {
      secondaryTarget.classList.add('joy-tour-spotlight-secondary')
    }
  }, [dockBubbleToCorner])

  const updateSpotlight = useCallback(() => {
    clearHighlights()
    setHighlightStyle(null)

    if (!step) {
      setBubbleStyle(FALLBACK_BUBBLE_STYLE)
      setBubbleDockMode(null)
      return
    }

    const target = document.querySelector(`[data-joy-tour="${step.target}"]`)
    if (!target) {
      setBubbleStyle(FALLBACK_BUBBLE_STYLE)
      setBubbleDockMode(null)
      return
    }

    target.classList.add('joy-tour-spotlight')

    const secondary = step.secondaryTarget
      ? document.querySelector(`[data-joy-tour="${step.secondaryTarget}"]`)
      : null

    const isMobile = window.innerWidth <= 767
    target.scrollIntoView({
      behavior: 'smooth',
      block: isMobile ? 'start' : 'center',
      inline: 'nearest',
    })
    applySpotlight(target, secondary, step)
    window.setTimeout(() => applySpotlight(target, secondary, step), 400)
  }, [step, clearHighlights, applySpotlight])

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
      {highlightStyle && (
        <div
          className="joy-tour__highlight-ring"
          style={highlightStyle}
          aria-hidden="true"
        />
      )}
      <div
        className={[
          'joy-tour__bubble',
          bubbleDockMode === 'bottom' ? 'joy-tour__bubble--dock-bottom' : '',
          bubbleDockMode === 'corner' ? 'joy-tour__bubble--dock-corner' : '',
        ].filter(Boolean).join(' ')}
        style={bubbleStyle}
      >
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
