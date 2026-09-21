import Reveal from './Reveal'
import { site } from '../data/siteData'
import { loadGalleryPhotos } from '../utils/loadPhotos'
import './About.css'

function About() {
  const aboutPhotos = loadGalleryPhotos().slice(1, 3)

  return (
    <section id="about" className="about section">
      <div className="container about__inner">
        <Reveal className="about__content" direction="left">
          <span className="section-label">About Us</span>
          <h2 className="section-title">A place where English learning feels inspiring</h2>
          <p>
            At {site.name}, we believe language opens doors. Since 2014, we have helped
            thousands of students speak, read, and write English with confidence — whether
            for school, career, travel, or global exams.
          </p>
          <p>
            Our classrooms combine structured curriculum with interactive activities,
            conversation practice, and continuous feedback so you progress at the right pace.
          </p>
          <ul className="about__list">
            <li>Cambridge-aligned curriculum</li>
            <li>Weekly progress reports for parents &amp; professionals</li>
            <li>Free placement test before enrollment</li>
          </ul>
        </Reveal>

        <Reveal className="about__visual" direction="right" delay={150}>
          {aboutPhotos.length > 0 && (
            <div className={`about__photos about__photos--count-${aboutPhotos.length}`}>
              {aboutPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`about__photo ${index === 0 ? 'about__photo--main' : 'about__photo--secondary'} img-zoom hover-lift`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </div>
              ))}
            </div>
          )}
          <div className="about__card hover-lift">
            <div className="about__card-icon" aria-hidden="true">🌟</div>
            <h3>Why families trust us</h3>
            <p>
              Rated 4.9/5 by students and parents for teaching quality, friendly staff,
              and visible results within the first month.
            </p>
            <a href="#contact" className="btn btn--secondary">Get Free Consultation</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default About
