import Reveal from './Reveal'
import { courses } from '../data/siteData'
import './Courses.css'

function Courses() {
  return (
    <section id="courses" className="courses section">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Our Programs</span>
            <h2 className="section-title">Courses for every learner</h2>
            <p className="section-subtitle">
              From first words to fluent professional English — find the right program for your goals.
            </p>
          </div>
        </Reveal>
        <div className="courses__grid">
          {courses.map((course, index) => (
            <Reveal key={course.title} delay={index * 80}>
              <article
                className={`course-card hover-lift ${course.highlight ? 'course-card--featured' : ''}`}
              >
                {course.highlight && <span className="course-card__badge">Most Popular</span>}
                <span className="course-card__level">{course.level}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-card__meta">
                  <span>{course.duration}</span>
                  <span>{course.schedule}</span>
                </div>
                <a href="#contact" className="course-card__link">Enquire Now →</a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses
