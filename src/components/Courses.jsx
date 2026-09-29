import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { courses, site } from '../data/siteData'
import { useSequentialGrowth } from '../hooks/useSequentialGrowth'
import './Courses.css'

const SECTION_MS = 1200

function Courses() {
  const treeRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const grownSections = useSequentialGrowth(courses.length, isActive, SECTION_MS)

  useEffect(() => {
    const element = treeRef.current
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

  const revealedCount = prefersReducedMotion && isActive ? courses.length : grownSections

  return (
    <section id="courses" className="courses section section--compact">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Academics</span>
            <h2 className="section-title">{site.grades}</h2>
            <p className="section-subtitle section-subtitle--compact-mobile">
              {site.board} curriculum — from early years to higher secondary, growing with every child.
            </p>
          </div>
        </Reveal>

        <div
          ref={treeRef}
          className={`academic-tree${isActive ? ' academic-tree--active' : ''}`}
          aria-label="Academic programs"
        >
          <ol className="academic-tree__stages">
            {courses.map((course, index) => {
              const isRevealed = revealedCount > index
              const isGrowing = revealedCount === index + 1 && !prefersReducedMotion

              return (
                <li
                  key={course.title}
                  className={[
                    'academic-tree__branch',
                    isRevealed ? 'academic-tree__branch--revealed' : '',
                    isGrowing ? 'academic-tree__branch--growing' : '',
                  ].filter(Boolean).join(' ')}
                  style={{ '--branch-index': index }}
                >
                  <article
                    className={`course-card academic-tree__card hover-lift ${course.highlight ? 'course-card--featured' : ''}`}
                  >
                    {course.highlight && <span className="course-card__badge">SSC</span>}
                    <span className="course-card__level">{course.level}</span>
                    <h3 className={course.titleBold ? 'course-card__title--bold' : undefined}>
                      {course.titleBold ? <strong>{course.title}</strong> : course.title}
                    </h3>
                    <p>{course.description}</p>
                    <div className="course-card__meta">
                      <span>{course.duration}</span>
                    </div>
                  </article>

                  <span className="academic-tree__stem" aria-hidden="true" />

                  <div className="academic-tree__node" aria-hidden="true">
                    <span className="academic-tree__node-ring" />
                    <span className="academic-tree__node-icon">{course.icon}</span>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="academic-tree__rail" aria-hidden="true">
            <span
              className={`academic-tree__roots${isActive ? ' academic-tree__roots--shown' : ''}`}
            />
            <div className="academic-tree__trunk">
              {courses.map((_, index) => (
                <span
                  key={index}
                  className={`academic-tree__trunk-seg${revealedCount > index ? ' academic-tree__trunk-seg--grown' : ''}`}
                  style={{ '--seg-index': index }}
                />
              ))}
            </div>
          </div>

          {isActive && revealedCount < courses.length && !prefersReducedMotion && (
            <p className="academic-tree__progress" aria-live="polite">
              Growing stage {revealedCount + 1} of {courses.length}…
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Courses
