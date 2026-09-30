import { memo, useEffect, useRef, useState } from 'react'
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
  const wasOnHero = useRef(false)
  const [floatSettled, setFloatSettled] = useState(false)
  const [sectionChanging, setSectionChanging] = useState(false)
  const prevActiveSection = useRef(activeSection)

  useEffect(() => {
    if (!isHero) return undefined
    if (!pastHero) {
      wasOnHero.current = true
      return undefined
    }
    if (wasOnHero.current) {
      markHeroEntrancePlayed()
    }
    return undefined
  }, [isHero, pastHero, markHeroEntrancePlayed])

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

  const isVisible = isHero
    ? !pastHero
    : isSectionAnchor
      ? pastHero && activeSection === sectionId
      : pastHero && !JOY_ANCHORED_SECTIONS.includes(activeSection)
  const showEntrance = isHero && !pastHero && !heroEntrancePlayed
  const showIntro = isHero && !pastHero && (showEntrance || isFirstVisit)
  const joyImage = isHero ? joyLaptop : joyStanding
  const entranceGuide = joyGuideMessages.homeFirstVisit
  const displayGuide = isHero && isFirstVisit ? entranceGuide : guide

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
