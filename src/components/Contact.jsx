import Reveal from './Reveal'
import { contact, site } from '../data/siteData'
import './Contact.css'

function Contact() {
  const whatsappUrl = `https://wa.me/${contact.phoneLink}?text=${encodeURIComponent(contact.whatsappMessage)}`

  return (
    <section id="contact" className="contact section">
      <div className="container contact__inner">
        <Reveal className="contact__info" direction="left">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Start your English journey today</h2>
          <p>
            Book a free demo class or speak with our counsellor. We will help you choose
            the right course and batch.
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
              const course = form.course.value
              const body = `Name: ${name}%0APhone: ${phone}%0ACourse: ${course}`
              window.location.href = `mailto:${contact.email}?subject=Enrollment Enquiry - ${site.name}&body=${body}`
            }}
          >
            <h3>Request a callback</h3>
            <label>
              Full Name
              <input type="text" name="name" required placeholder="Your name" />
            </label>
            <label>
              Phone Number
              <input type="tel" name="phone" required placeholder="+91 98765 43210" />
            </label>
            <label>
              Course Interest
              <select name="course" required defaultValue="">
                <option value="" disabled>Select a course</option>
                <option>English Foundations</option>
                <option>Confident Communicator</option>
                <option>Professional English</option>
                <option>Galaxy Juniors</option>
                <option>IELTS &amp; TOEFL</option>
                <option>Business English</option>
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
