import { useMemo } from 'react'
import {
  GENERIC_ACHIEVER_NAME,
  SSC_HIGH_PERCENT,
  SSC_TIER_PERCENT,
  sscAchievements,
} from '../data/boardResults'
import Reveal from './Reveal'
import './Achievements.css'

const achievementImages = import.meta.glob('../assets/achievements/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

function resolvePhoto(imageFile) {
  const key = `../assets/achievements/${imageFile}`
  return achievementImages[key] ?? null
}

function formatPercent(value) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(2)}%`
}

function studentScore(s) {
  const p = Number(s.percent)
  return Number.isFinite(p) ? p : -1
}

/** Small card: no published % or anonymous SSC achiever. */
function isSmallMoreAchiever(student) {
  return student.name === GENERIC_ACHIEVER_NAME || student.percent == null || student.percent === ''
}

/** Highest % first; anonymous “SSC Achiever” cards always last within each group. */
function compareStudents(a, b) {
  const diff = studentScore(b) - studentScore(a)
  if (diff !== 0) return diff
  const aGeneric = a.name === GENERIC_ACHIEVER_NAME ? 1 : 0
  const bGeneric = b.name === GENERIC_ACHIEVER_NAME ? 1 : 0
  if (aGeneric !== bGeneric) return aGeneric - bGeneric
  return a.imageFile.localeCompare(b.imageFile)
}

function Achievements() {
  const students = sscAchievements.students
  const topStudents = useMemo(
    () =>
      students
        .filter((s) => Number(s.percent) >= SSC_TIER_PERCENT)
        .sort(compareStudents),
    [students],
  )
  const belowStudents = useMemo(
    () =>
      students
        .filter((s) => studentScore(s) < SSC_TIER_PERCENT)
        .sort(compareStudents),
    [students],
  )
  const renderCard = (student, { row = 'below' } = {}) => {
    const photo = resolvePhoto(student.imageFile)
    const isTopRow = row === 'top'
    const isStar = Boolean(student.starStudent) && isTopRow
    const isElite = Number(student.percent) >= SSC_HIGH_PERCENT
    const isMicro = !isTopRow && isSmallMoreAchiever(student)

    return (
      <article
        className={[
          'achievements__card',
          'hover-lift',
          isTopRow ? 'achievements__card--top' : 'achievements__card--compact',
          isMicro ? 'achievements__card--micro' : '',
          isStar ? 'achievements__card--featured' : '',
          isTopRow && isElite ? 'achievements__card--elite' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isStar && <p className="achievements__star-label">Star student</p>}
        <div className="achievements__photo-wrap">
          {photo ? (
            <img
              src={photo}
              alt={
                student.name === GENERIC_ACHIEVER_NAME
                  ? 'SSC achiever'
                  : `${student.name}, SSC ${formatPercent(student.percent)}`
              }
              className="achievements__photo"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="achievements__photo achievements__photo--empty" aria-hidden="true">
              ★
            </span>
          )}
          {isTopRow && isElite && <span className="achievements__badge">95+</span>}
        </div>
        <h3 className="achievements__percent">{formatPercent(student.percent)}</h3>
        <p className="achievements__name">{student.name}</p>
      </article>
    )
  }

  return (
    <section
      id="achievements"
      className="achievements section section--alt section--compact"
      data-joy-tour="achievements"
      aria-labelledby="achievements-title"
    >
      <div className="container achievements__container">
        <Reveal>
          <div className="section-header achievements__header">
            <span className="section-label">Achievements</span>
            <h2 id="achievements-title" className="section-title">
              SSC results — Std 10 State Board
            </h2>
            <p className="section-subtitle section-subtitle--compact-mobile">{sscAchievements.tagline}</p>
          </div>
        </Reveal>

        <div className="achievements__body">
          <Reveal delay={80}>
            <div className="achievements__stats">
              <div className="achievements__highlights">
                <article className="achievements__highlight">
                  <span className="achievements__highlight-value">{sscAchievements.passRatePercent}%</span>
                  <span className="achievements__highlight-label">
                    Pass rate ({sscAchievements.passRatePeriod})
                  </span>
                </article>
                <article className="achievements__highlight achievements__highlight--gold">
                  <span className="achievements__highlight-value">{sscAchievements.students90PlusDisplay}</span>
                  <span className="achievements__highlight-label">Students at 90% &amp; above</span>
                </article>
                <article className="achievements__highlight">
                  <span className="achievements__highlight-value">{students.length}</span>
                  <span className="achievements__highlight-label">Achievers featured</span>
                </article>
              </div>
              <p className="achievements__exam">{sscAchievements.examLabel}</p>
            </div>
          </Reveal>

          {topStudents.length > 0 && (
            <Reveal delay={100}>
              <div className="achievements__row-block">
                <p className="achievements__row-heading">90% and above</p>
                <ul className="achievements__grid achievements__grid--top">
                  {topStudents.map((student) => (
                    <li key={student.imageFile} className="achievements__grid-cell">
                      {renderCard(student, { row: 'top' })}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {belowStudents.length > 0 && (
            <Reveal delay={140}>
              <div className="achievements__row-block achievements__row-block--below">
                <p className="achievements__row-heading">More achievers</p>
                <ul className="achievements__grid achievements__grid--below">
                  {belowStudents.map((student, index) => {
                    const isMicroCell = isSmallMoreAchiever(student)
                    return (
                      <li
                        key={student.imageFile}
                        className={
                          isMicroCell
                            ? 'achievements__grid-cell achievements__grid-cell--micro'
                            : 'achievements__grid-cell'
                        }
                      >
                        <Reveal delay={80 + index * 20} className="achievements__reveal">
                          {renderCard(student)}
                        </Reveal>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          )}

          <p className="achievements__disclaimer">{sscAchievements.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}

export default Achievements