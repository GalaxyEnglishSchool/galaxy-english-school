import Reveal from './Reveal'
import { testimonials } from '../data/siteData'
import './Testimonials.css'

function Testimonials() {
  return (
    <section id="reviews" className="testimonials section section--alt">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Student Stories</span>
            <h2 className="section-title">What our students say</h2>
          </div>
        </Reveal>
        <div className="testimonials__grid">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 120}>
              <article className="testimonial-card hover-lift">
                <div className="testimonial-card__stars" aria-label={`${item.rating} out of 5 stars`}>
                  {'★'.repeat(item.rating)}
                </div>
                <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
