import Reveal from './Reveal'
import { features } from '../data/siteData'
import './Features.css'

function Features() {
  return (
    <section id="facilities" className="features section section--alt">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Facilities</span>
            <h2 className="section-title">What we provide for our students</h2>
            <p className="section-subtitle">
              Modern infrastructure and support systems for academic excellence, safety, and all-round growth.
            </p>
          </div>
        </Reveal>
        <div className="features__grid">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80}>
              <article className="feature-card hover-lift">
                <span className="feature-card__icon" aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
