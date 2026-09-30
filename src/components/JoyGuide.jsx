import { memo, useCallback, useEffect, useRef, useState } from 'react'
import joyHi from '../assets/joy-hi.png'
import joyLaptop from '../assets/Showwebsite.png'
import joyRunning from '../assets/joy-running.png'
import joyStanding from '../assets/joy-standing.png'
import { JOY_ANCHORED_SECTIONS, joyGuideMessages } from '../data/joyGuideData'
import { useJoyGuide } from '../context/JoyGuideContext'
import './JoyGuide.css'

function JoyGuide({ variant = 'float', sectionId = null }) {
  const {
    activeSection,
    pastHero,
    guide,
    isFirstVisit,
    dismissIntro,
    heroEntrancePlayed,
    markHeroEntrancePlayed,
    siteTourActive,
    startSiteTour,
  } = useJoyGuide()
  const isHero = variant === 'hero'
  const isSectionAnchor = variant === 'section' && sectionId
  const isFloat = variant === 'float'
  const [heroEntranceDone, setHeroEntranceDone] = useState(false)
  const [floatSettled, setFloatSettled] = useState(false)
  const [sectionChanging, setSectionChanging] = useState(false)
  const [useFixedDock, setUseFixedDock] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches,
  )
  const prevActiveSection = useRef(activeSection)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)')
    const syncDockMode = () => setUseFixedDock(mediaQuery.matches)
    syncDockMode()
    mediaQuery.addEventListener('change', syncDockMode)
    return () => mediaQuery.removeEventListener('change', syncDockMode)
  }, [])

  const entranceDone = isHero ? heroEntranceDone : true
  const showEntrance = isHero && !heroEntranceDone
  const showIntro = isHero && (showEntrance || (isFirstVisit && !pastHero))
  const joyImage = isHero ? joyLaptop : joyStanding
  const entranceGuide = joyGuideMessages.homeFirstVisit
  const displayGuide = isHero && isFirstVisit ? entranceGuide : guide

  const isVisible = isHero
    ? !pastHero
    : isSectionAnchor
      ? pastHero && activeSection === sectionId && heroEntrancePlayed && !useFixedDock
      : isFloat
        ? pastHero
          && heroEntrancePlayed
          && (!JOY_ANCHORED_SECTIONS.includes(activeSection) || useFixedDock)
        : false

  const completeEntrance = useCallback(() => {
    setHeroEntranceDone(true)
    markHeroEntrancePlayed()
  }, [markHeroEntrancePlayed])

  useEffect(() => {
    if (!isHero || heroEntranceDone) return undefined

    const timer = window.setTimeout(completeEntrance, 3100)
    return () => window.clearTimeout(timer)
  }, [isHero, heroEntranceDone, completeEntrance])

  useEffect(() => {
    if (!isHero || !pastHero || heroEntranceDone || window.scrollY < 120) return undefined
    completeEntrance()
    return undefined
  }, [isHero, pastHero, heroEntranceDone, completeEntrance])

  useEffect(() => {
    if (!isFloat || !pastHero) {
      setFloatSettled(false)
      return undefined
    }

    const timer = window.setTimeout(() => setFloatSettled(true), 450)
    return () => window.clearTimeout(timer)
  }, [isFloat, pastHero])

  useEffect(() => {
    if (!isFloat || !floatSettled || prevActiveSection.current === activeSection) {
      prevActiveSection.current = activeSection
      return undefined
    }

    prevActiveSection.current = activeSection
    setSectionChanging(true)
    const timer = window.setTimeout(() => setSectionChanging(false), 220)
    return () => window.clearTimeout(timer)
  }, [activeSection, isFloat, floatSettled])

  if (!isVisible || siteTourActive) return null

  const tourButton = (
    <button
      type="button"
      className="joy-guide__cta joy-guide__cta--tour btn btn--primary"
      onClick={startSiteTour}
    >
      Start site tour
    </button>
  )

  return (
    <div
      className={[
        'joy-guide',
        `joy-guide--${isSectionAnchor ? 'section' : variant}`,
        isSectionAnchor ? `joy-guide--section-${sectionId}` : '',
        showIntro ? 'joy-guide--intro' : '',
        showEntrance ? 'joy-guide--entrance' : '',
        isFloat && floatSettled ? 'joy-guide--settled' : '',
        isFloat && sectionChanging ? 'joy-guide--section-change' : '',
        !isHero && !isSectionAnchor ? `joy-guide--section-${activeSection}` : '',
      ].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      <div className="joy-guide__character" aria-hidden="true">
        <span className="joy-guide__spark joy-guide__spark--1">✦</span>
        <span className="joy-guide__spark joy-guide__spark--2">✦</span>
        <div className={`joy-guide__avatar${isHero && !showEntrance ? '' : ' joy-guide__avatar--standing'}`}>
          {showEntrance ? (
            <>
              <img src={joyRunning} alt="" className="joy-guide__sprite joy-guide__sprite--run" loading="eager" decoding="async" />
              <img src={joyHi} alt="" className="joy-guide__sprite joy-guide__sprite--hi" loading="eager" decoding="async" />
              <img src={joyLaptop} alt="" className="joy-guide__sprite joy-guide__sprite--guide" loading="eager" decoding="async" />
            </>
          ) : (
            <img
              src={joyImage}
              alt=""
              className="joy-guide__image"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      </div>

      {showEntrance ? (
        <>
          <div className="joy-guide__bubble joy-guide__bubble--hi-phase" aria-hidden="true">
            <p className="joy-guide__line joy-guide__line--hi">Hi! 👋</p>
          </div>
          <div className="joy-guide__bubble joy-guide__bubble--guide-phase">
            <p className="joy-guide__label">{entranceGuide.title}</p>
            {entranceGuide.lines.map((line, index) => (
              <p
                key={line}
                className="joy-guide__line"
                style={{ '--line-index': index }}
              >
                {line}
              </p>
            ))}
            <div className="joy-guide__actions">
              {tourButton}
              {isFirstVisit && (
                <button
                  type="button"
                  className="joy-guide__cta joy-guide__cta--dismiss btn btn--outline"
                  onClick={dismissIntro}
                >
                  Got it!
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="joy-guide__bubble">
          <p className="joy-guide__label">{displayGuide.title}</p>
          {displayGuide.lines.map((line, index) => (
            <p
              key={`${activeSection}-${line}`}
              className="joy-guide__line"
              style={{ '--line-index': index }}
            >
              {line}
            </p>
          ))}
          <div className="joy-guide__actions">
            {tourButton}
            {isHero && isFirstVisit && (
              <button
                type="button"
                className="joy-guide__cta joy-guide__cta--dismiss btn btn--outline"
                onClick={dismissIntro}
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(JoyGuide)
