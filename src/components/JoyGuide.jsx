import { useEffect, useState } from 'react'
import joyLaptop from '../assets/Showwebsite.png'
import joyStanding from '../assets/joy-standing.png'
import { useJoyGuide } from '../context/JoyGuideContext'
import './JoyGuide.css'

function JoyGuide({ variant = 'float' }) {
  const { activeSection, guide, isFirstVisit, dismissIntro } = useJoyGuide()
  const isHero = variant === 'hero'
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const update = () => {
      const home = document.getElementById('home')
      if (!home) return
      setPastHero(home.getBoundingClientRect().bottom < window.innerHeight * 0.55)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const isVisible = isHero ? !pastHero : pastHero
  const showIntro = isHero && isFirstVisit && !pastHero
  const joyImage = isHero ? joyLaptop : joyStanding

  if (!isVisible) return null

  return (
    <div
      className={[
        'joy-guide',
        `joy-guide--${variant}`,
        showIntro ? 'joy-guide--intro' : '',
        !isHero ? `joy-guide--section-${activeSection}` : '',
      ].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      <div className="joy-guide__character" aria-hidden="true">
        <span className="joy-guide__spark joy-guide__spark--1">✦</span>
        <span className="joy-guide__spark joy-guide__spark--2">✦</span>
        <div className={`joy-guide__avatar${isHero ? '' : ' joy-guide__avatar--standing'}`}>
          <img
            src={joyImage}
            alt=""
            className="joy-guide__image"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className="joy-guide__bubble" key={`${activeSection}-${showIntro ? 'intro' : 'default'}`}>
        <p className="joy-guide__label">{guide.title}</p>
        {guide.lines.map((line, index) => (
          <p
            key={line}
            className="joy-guide__line"
            style={{ '--line-index': index }}
          >
            {line}
          </p>
        ))}
        {showIntro && (
          <button
            type="button"
            className="joy-guide__cta btn btn--primary"
            onClick={dismissIntro}
          >
            Got it!
          </button>
        )}
      </div>
    </div>
  )
}

export default JoyGuide
