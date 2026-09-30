import heroImage from '../assets/Photo1.jpg'
import { photoCaptions, site } from '../data/siteData'
import JoyGuide from './JoyGuide'
import './Hero.css'

function Hero() {
  return (
    <section id="home" className="hero" data-joy-tour="home">
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

        <div className="hero__visual animate-fade-up delay-4">
          <div className="hero__image-wrap animate-float img-zoom">
            <img
              src={heroImage}
              alt={photoCaptions['Photo1.jpg'].alt}
              fetchPriority="high"
              decoding="async"
              width={960}
              height={720}
            />
            <div className="hero__image-shine" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="hero__joy-track">
        <JoyGuide variant="hero" key="joy-hero" />
      </div>
    </section>
  )
}

export default Hero
