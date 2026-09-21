import { useState } from 'react'
import schoolLogo from '../assets/school.png'
import { navLinks, site } from '../data/siteData'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#home" className="header__logo" onClick={closeMenu}>
          <img src={schoolLogo} alt="" className="header__logo-img" />
          <span>{site.name}</span>
        </a>

        <button
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{ '--nav-delay': `${index * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary btn--sm" onClick={closeMenu}>
            Enroll Now
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
