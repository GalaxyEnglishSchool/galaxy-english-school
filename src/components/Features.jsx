import Reveal from './Reveal'
import { features } from '../data/siteData'
import './Features.css'

function Features() {
  return (
    <section className="features section section--alt">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">Everything you need to succeed</h2>
          </div>
        </Reveal>
        <div className="features__grid">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 100}>
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
