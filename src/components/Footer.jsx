import schoolLogo from '../assets/school.png'
import { contact, site } from '../data/siteData'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={schoolLogo} alt="" className="footer__logo" width={32} height={32} decoding="async" />
          <div className="footer__brand-text">
            <strong>{site.name}</strong>
            <span>UDISE {site.udiseNumber}</span>
          </div>
        </div>

        <div className="footer__contact">
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          <span className="footer__sep" aria-hidden="true">·</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
