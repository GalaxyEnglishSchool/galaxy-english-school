import Reveal from './Reveal'
import { loadGalleryPhotos } from '../utils/loadPhotos'
import './Gallery.css'

function Gallery() {
  const photos = loadGalleryPhotos()

  if (photos.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="gallery section section--alt">
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

        <div className="gallery__grid">
          {photos.map((photo, index) => (
            <Reveal key={photo.id} delay={index * 100} direction="scale">
              <figure
                className={`gallery__item ${index === 0 ? 'gallery__item--featured' : ''} hover-lift`}
              >
                <div className="gallery__image img-zoom">
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <div className="gallery__overlay">
                    <span>{photo.caption}</span>
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
