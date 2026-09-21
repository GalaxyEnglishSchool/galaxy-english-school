import Reveal from './Reveal'
import { contact, courses, site } from '../data/siteData'
import './Contact.css'

function Contact() {
  const whatsappUrl = `https://wa.me/${contact.phoneLink}?text=${encodeURIComponent(contact.whatsappMessage)}`

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
                <span>{contact.address}</span>
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
          <a href={whatsappUrl} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </Reveal>

        <Reveal direction="right" delay={150}>
          <form
            className="contact__form hover-lift"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target
              const name = form.name.value
              const phone = form.phone.value
              const grade = form.grade.value
              const body = `Name: ${name}%0APhone: ${phone}%0AGrade/Program: ${grade}`
              window.location.href = `mailto:${contact.email}?subject=Admission Enquiry - ${site.name}&body=${body}`
            }}
          >
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
            <button type="submit" className="btn btn--primary btn--full">
              Send Enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
