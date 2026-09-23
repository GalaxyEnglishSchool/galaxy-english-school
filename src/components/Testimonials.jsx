import { milestones } from '../data/siteData'
import './Testimonials.css'

function Testimonials() {
  return (
    <section id="journey" className="testimonials section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Our Journey</span>
          <h2 className="section-title">From vision to a thriving school</h2>
        </div>

        <div className="testimonials__grid">
          {milestones.map((item) => (
            <article key={`${item.year}-${item.title}`} className="testimonial-card">
              <span className="testimonial-card__year">{item.year}</span>
              <h3 className="testimonial-card__title">{item.title}</h3>
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
