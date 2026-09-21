import Reveal from './Reveal'
import { aboutStory, site } from '../data/siteData'
import { loadGalleryPhotos } from '../utils/loadPhotos'
import './About.css'

function About() {
  const aboutPhotos = loadGalleryPhotos().slice(1, 3)

  return (
    <section id="about" className="about section">
      <div className="container about__inner">
        <Reveal className="about__content" direction="left">
          <span className="section-label">About Us</span>
          <h2 className="section-title">{aboutStory.title}</h2>
          <p className="about__board-badge">{site.board} · {site.grades}</p>
          {aboutStory.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <ul className="about__list">
            {aboutStory.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
            <h3>Our Founding Family</h3>
            <p>{aboutStory.foundersNote}</p>
            <a href="#contact" className="btn btn--secondary">Enquire for Admission</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default About
