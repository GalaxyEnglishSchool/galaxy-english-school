import Carousel from './Carousel'
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

        <Carousel ariaLabel="School photo gallery" className="carousel--photos" mode="marquee">
          {photos.map((photo) => (
            <figure key={photo.id} className="gallery__slide-card hover-lift">
              <div className="gallery__image gallery__image--slide">
                <img src={photo.src} alt={photo.alt} loading="lazy" />
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
