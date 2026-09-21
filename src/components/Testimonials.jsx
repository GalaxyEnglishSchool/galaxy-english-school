import Reveal from './Reveal'
import { milestones } from '../data/siteData'
import './Testimonials.css'

function Testimonials() {
  return (
    <section id="journey" className="testimonials section section--alt">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Our Journey</span>
            <h2 className="section-title">From vision to a thriving school</h2>
          </div>
        </Reveal>
        <div className="testimonials__grid">
          {milestones.map((item, index) => (
            <Reveal key={`${item.year}-${item.title}`} delay={index * 120}>
              <article className="testimonial-card hover-lift">
                <span className="testimonial-card__year">{item.year}</span>
                <h3 className="testimonial-card__title">{item.title}</h3>
                <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
