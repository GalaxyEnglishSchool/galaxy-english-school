import schoolLogo from '../assets/school.png'
import { contact, footerLinks, site } from '../data/siteData'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <img src={schoolLogo} alt="" />
            {site.name}
          </span>
          <p>{site.tagline}</p>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </nav>
        <div className="footer__contact">
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
