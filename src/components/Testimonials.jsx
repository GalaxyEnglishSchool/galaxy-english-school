import { useEffect, useRef, useState } from 'react'
import { milestones } from '../data/siteData'
import { useSequentialGrowth } from '../hooks/useSequentialGrowth'
import './Testimonials.css'

const STEP_MS = 1100
const TOTAL_STEPS = milestones.length

const STEP_SIZE_CLASS = [
  'journey-ladder__step--sm',
  'journey-ladder__step--md',
  'journey-ladder__step--lg',
]

function Testimonials() {
  const ladderRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const grownSteps = useSequentialGrowth(TOTAL_STEPS, isActive, STEP_MS)

  useEffect(() => {
    const element = ladderRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const revealedCount = prefersReducedMotion && isActive ? TOTAL_STEPS : grownSteps

  return (
    <section id="journey" className="testimonials section section--alt section--compact" data-joy-tour="journey">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Our Journey</span>
          <h2 className="section-title">From vision to a thriving school</h2>
        </div>

        <div
          ref={ladderRef}
          className={`journey-ladder${isActive ? ' journey-ladder--active' : ''}`}
          aria-label="School journey milestones"
        >
          <div className="journey-ladder__track">
            <span
              className={`journey-ladder__start${isActive ? ' journey-ladder__start--shown' : ''}`}
              aria-hidden="true"
            />

            <ol className="journey-ladder__steps">
              {milestones.map((item, index) => {
                const isRevealed = revealedCount > index
                const isGrowing = revealedCount === index + 1 && !prefersReducedMotion

                return (
                  <li
                    key={`${item.year}-${item.title}`}
                    className={[
                      'journey-ladder__step',
                      STEP_SIZE_CLASS[index],
                      isRevealed ? 'journey-ladder__step--revealed' : '',
                      isGrowing ? 'journey-ladder__step--growing' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ '--step-index': index }}
                  >
                    <article className="journey-ladder__card testimonial-card">
                      <h3 className="testimonial-card__title">{item.title}</h3>
                      <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                      {item.highlights?.length > 0 && (
                        <ul className="journey-ladder__highlights">
                          {item.highlights.map((point) => (
                            <li key={point.text}>
                              <span aria-hidden="true">{point.icon}</span>
                              {point.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>

                  <span className="journey-ladder__stem" aria-hidden="true" />

                  <div className="journey-ladder__marker" aria-hidden="true">
                    <span className="journey-ladder__marker-ring" />
                    <span className="journey-ladder__marker-year">{item.year}</span>
                  </div>

                  <span
                    className={`journey-ladder__seg${isRevealed ? ' journey-ladder__seg--grown' : ''}`}
                    aria-hidden="true"
                  />
                </li>
              )
              })}
            </ol>
          </div>

          {isActive && revealedCount < TOTAL_STEPS && !prefersReducedMotion && (
            <p className="journey-ladder__progress" aria-live="polite">
              Climbing step {revealedCount + 1} of {TOTAL_STEPS}…
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
