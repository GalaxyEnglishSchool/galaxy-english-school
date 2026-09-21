import Reveal from './Reveal'
import { courses, site } from '../data/siteData'
import './Courses.css'

function Courses() {
  return (
    <section id="courses" className="courses section">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Academics</span>
            <h2 className="section-title">{site.grades}</h2>
            <p className="section-subtitle">
              {site.board} curriculum from early years through higher secondary,
              with NEET/JEE foundation and holistic development at every stage.
            </p>
          </div>
        </Reveal>
        <div className="courses__grid">
          {courses.map((course, index) => (
            <Reveal key={course.title} delay={index * 80}>
              <article
                className={`course-card hover-lift ${course.highlight ? 'course-card--featured' : ''}`}
              >
                {course.highlight && <span className="course-card__badge">SSC Preparation</span>}
                <span className="course-card__level">{course.level}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-card__meta">
                  <span>{course.duration}</span>
                  <span>{course.schedule}</span>
                </div>
                <a href="#contact" className="course-card__link">Enquire for Admission →</a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses
