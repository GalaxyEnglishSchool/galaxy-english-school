import { useEffect, useState } from 'react'
import Carousel from './Carousel'
import Reveal from './Reveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadGalleryPhotos } from '../utils/loadPhotos'
import './Gallery.css'

function Gallery() {
  const [photos, setPhotos] = useState([])
  const isMobile = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    let active = true

    loadGalleryPhotos().then((items) => {
      if (active) setPhotos(items)
    })

    return () => {
      active = false
    }
  }, [])

  if (photos.length === 0) {
    return (
      <section id="gallery" className="gallery section section--alt section--compact" data-joy-tour="gallery">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <span className="section-label">Campus Life</span>
              <h2 className="section-title">See our school in action</h2>
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="gallery section section--alt section--compact" data-joy-tour="gallery">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <span className="section-label">Campus Life</span>
            <h2 className="section-title">See our school in action</h2>
            <p className="section-subtitle">
              Real classrooms, real students, real progress — experience the Galaxy difference.
            </p>
          </div>
        </Reveal>

        <Carousel
          ariaLabel="School photo gallery"
          className="carousel--photos"
          mode={isMobile ? 'slide' : 'marquee'}
          interval={5500}
          marqueeSecondsPerSlide={9}
        >
          {photos.map((photo, index) => (
            <figure key={photo.id} className="gallery__slide-card hover-lift">
              <div className="gallery__image gallery__image--slide">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div className="gallery__overlay">
                  <span>{photo.caption}</span>
                </div>
              </div>
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export default Gallery
