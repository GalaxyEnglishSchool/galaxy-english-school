import schoolLogo from '../assets/school.png'
import { site } from '../data/siteData'
import { getPhotoAt } from '../utils/loadPhotos'
import './Hero.css'

function Hero() {
  const heroPhoto = getPhotoAt(0)

  return (
    <section id="home" className="hero">
      <div className="hero__stars" aria-hidden="true" />
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__badge animate-fade-up">Admissions Open · {site.grades}</span>
          <h1 className="hero__title animate-fade-up delay-1">
            Welcome to
            <span className="hero__highlight"> {site.name}</span>
          </h1>
          <p className="hero__board animate-fade-up delay-2">
            {site.board} · {site.location}
          </p>
          <p className="hero__text animate-fade-up delay-2">{site.description}</p>
          <div className="hero__actions animate-fade-up delay-3">
            <a href="#contact" className="btn btn--primary btn--glow">Apply for Admission</a>
            <a href="#courses" className="btn btn--outline">View Academics</a>
          </div>
        </div>

        {heroPhoto && (
          <div className="hero__visual animate-fade-up delay-4">
            <div className="hero__logo-float animate-float-slow">
              <img src={schoolLogo} alt={`${site.name} logo`} />
            </div>
            <div className="hero__image-wrap animate-float img-zoom">
              <img src={heroPhoto.src} alt={heroPhoto.alt} />
              <div className="hero__image-shine" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
