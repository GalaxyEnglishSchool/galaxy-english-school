import Reveal from './Reveal'
import { features } from '../data/siteData'
import './Features.css'

function Features() {
  return (
    <section id="facilities" className="features section section--alt section--compact">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Facilities</span>
            <h2 className="section-title">What we provide for our students</h2>
            <p className="section-subtitle section-subtitle--compact-mobile">
              Modern infrastructure for academic excellence, safety, and all-round growth.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <ul className="facilities-grid" aria-label="School facilities">
            {features.map((feature) => (
              <li key={feature.title} className="facilities-grid__item">
                <article className="facility-card hover-lift">
                  <span className="facility-card__icon" aria-hidden="true">{feature.icon}</span>
                  <div className="facility-card__body">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export default Features
