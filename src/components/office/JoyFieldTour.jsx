import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import joyStanding from '../../assets/joy-standing.png'
import './JoyFieldTour.css'

const FALLBACK_BUBBLE_STYLE = {
  top: 'auto',
  bottom: '6.5rem',
  right: '1.25rem',
  left: 'auto',
}

const INITIAL_SPOTLIGHT = {
  highlight: null,
  bubble: FALLBACK_BUBBLE_STYLE,
  dockMode: null,
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

  const [spotlight, setSpotlight] = useState(INITIAL_SPOTLIGHT)
  const scrollFrame = useRef(null)

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

    const highlight = {
      top: rect.top - padding,
      left: Math.max(0, rect.left - padding),
      width: Math.min(window.innerWidth - inset, rect.width + padding * 2),
      height: rect.height + padding * 2,
    }

    let bubble = FALLBACK_BUBBLE_STYLE
    let dockMode = null

    if (isMobile) {
      const bubbleWidth = Math.min(188, window.innerWidth - 16)
      dockMode = 'bottom'
      bubble = {
        bottom: '0.5rem',
        left: `${(window.innerWidth - bubbleWidth) / 2}px`,
        top: 'auto',
        right: 'auto',
      }
    } else if (dockCorner) {
      dockMode = 'corner'
      bubble = {
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        right: 'max(1.25rem, env(safe-area-inset-right))',
        top: 'auto',
        left: 'auto',
      }
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

      bubble = { top, left: bubbleLeft, bottom: 'auto', right: 'auto' }
    }

    if (secondaryTarget) {
      secondaryTarget.classList.add('joy-tour-spotlight-secondary')
    }

    setSpotlight({ highlight, bubble, dockMode })
  }, [dockBubbleToCorner])

  const updateSpotlight = useCallback(() => {
    clearHighlights()

    if (!step) {
      setSpotlight(INITIAL_SPOTLIGHT)
      return
    }

    const target = document.querySelector(`[data-joy-tour="${step.target}"]`)
    if (!target) {
      setSpotlight(INITIAL_SPOTLIGHT)
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

    const scheduleSpotlightUpdate = () => {
      if (scrollFrame.current) return
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = null
        updateSpotlight()
      })
    }

    const frame = window.requestAnimationFrame(updateSpotlight)
    window.addEventListener('resize', scheduleSpotlightUpdate)
    window.addEventListener('scroll', scheduleSpotlightUpdate, { passive: true, capture: true })

    return () => {
      window.cancelAnimationFrame(frame)
      if (scrollFrame.current) {
        window.cancelAnimationFrame(scrollFrame.current)
        scrollFrame.current = null
      }
      window.removeEventListener('resize', scheduleSpotlightUpdate)
      window.removeEventListener('scroll', scheduleSpotlightUpdate, true)
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

  const { highlight: highlightStyle, bubble: bubbleStyle, dockMode: bubbleDockMode } = spotlight

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
