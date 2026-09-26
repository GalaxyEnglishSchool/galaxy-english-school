import { getDirectionsEmbedUrl, getGoogleMapsDirectionsUrl } from '../../utils/busDistance'

function DirectionsMap({ destination }) {
  const embedUrl = getDirectionsEmbedUrl(destination)
  const openUrl = getGoogleMapsDirectionsUrl(destination)

  return (
    <div className="directions-map">
      <div className="directions-map__header">
        <strong>
          <span aria-hidden="true">📍</span>
          Live route
        </strong>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-map__open"
        >
          Open in Google Maps ↗
        </a>
      </div>
      <iframe
        title={`Directions from school to ${destination}`}
        src={embedUrl}
        className="directions-map__frame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <p className="directions-map__hint">
        👆 Note the <strong>distance in km</strong> shown on the route panel, then enter it in step 3.
      </p>
    </div>
  )
}

export default DirectionsMap
