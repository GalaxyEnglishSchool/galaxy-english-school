import Reveal from './Reveal'
import { contact, courses, site } from '../data/siteData'
import './Contact.css'

function buildWhatsAppUrl(message) {
  return `https://wa.me/${contact.phoneLink}?text=${encodeURIComponent(message)}`
}

function Contact() {
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappMessage)

  const handleEnquirySubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value.trim()
    const phone = form.phone.value.trim()
    const grade = form.grade.value

    const message = `Hello! I would like to enquire about admission at ${site.name}.

Name: ${name}
Phone: ${phone}
Grade: ${grade}`

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="contact section">
      <div className="container contact__inner">
        <Reveal className="contact__info" direction="left">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Enquire about admission</h2>
          <p>
            Contact us for admission enquiries for {site.grades}. Our office team
            will guide you through the process and answer your questions.
          </p>
          <ul className="contact__details">
            <li>
              <span className="contact__icon" aria-hidden="true">📞</span>
              <div>
                <strong>Phone</strong>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true">✉️</span>
              <div>
                <strong>Email</strong>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true">📍</span>
              <div>
                <strong>Address</strong>
                <a
                  href={contact.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__map-link"
                >
                  {contact.address}
                </a>
              </div>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true">🕐</span>
              <div>
                <strong>Hours</strong>
                <span>{contact.hours}</span>
              </div>
            </li>
          </ul>
          <div className="contact__actions">
            <a href={whatsappUrl} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
            <a
              href={contact.mapsLink}
              className="btn btn--secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </div>
        </Reveal>

        <Reveal direction="right" delay={150}>
          <form className="contact__form hover-lift" onSubmit={handleEnquirySubmit}>
            <h3>Admission enquiry form</h3>
            <label>
              Parent / Student Name
              <input type="text" name="name" required placeholder="Your name" />
            </label>
            <label>
              Phone Number
              <input type="tel" name="phone" required placeholder="+91 98765 43210" />
            </label>
            <label>
              Grade / Program
              <select name="grade" required defaultValue="">
                <option value="" disabled>Select grade or program</option>
                {courses.map((course) => (
                  <option key={course.title} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn--whatsapp btn--full">
              Send Enquiry on WhatsApp
            </button>
          </form>
        </Reveal>
      </div>

      <div className="container contact__map-wrap">
        <a
          href={contact.mapsLink}
          className="contact__map-card"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Galaxy English School location in Google Maps"
        >
          <div className="contact__map-pin" aria-hidden="true">📍</div>
          <div>
            <strong>Find us on Google Maps</strong>
            <p>Tap to open location, get directions, or share with parents</p>
          </div>
          <span className="contact__map-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

export default Contact
