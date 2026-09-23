import { useState } from 'react'
import allInOneFrame from '../assets/Allin1frame.JPG'
import photos from '../assets/Photos.jpg'
import Reveal from './Reveal'
import { aboutStory, site } from '../data/siteData'
import './About.css'

const aboutPhotos = [
  {
    id: 'allin1frame',
    src: allInOneFrame,
    alt: 'Galaxy English School staff, students, and dignitaries group photo',
  },
  {
    id: 'photos',
    src: photos,
    alt: 'Galaxy Kids Annual Day celebration at Galaxy English School',
  },
]

function About() {
  const [expanded, setExpanded] = useState(false)
  const visibleParagraphs = expanded
    ? aboutStory.paragraphs
    : aboutStory.paragraphs.slice(0, 2)

  return (
    <section id="about" className="about section">
      <div className="container about__inner">
        <Reveal className="about__content" direction="left">
          <span className="section-label">About Us</span>
          <h2 className="section-title">{aboutStory.title}</h2>
          <p className="about__board-badge">{site.board} · {site.grades}</p>
          {visibleParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {aboutStory.paragraphs.length > 2 && (
            <button
              type="button"
              className="about__read-more"
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? 'Show less ↑' : 'Read full story ↓'}
            </button>
          )}
          <ul className="about__list">
            {aboutStory.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="about__visual" direction="right" delay={150}>
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
