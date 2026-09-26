import { useEffect, useState } from 'react'
import { getDirectionsEmbedUrl, getGoogleMapsDirectionsUrl } from '../../utils/busDistance'
import { getDrivingDistanceKm } from '../../utils/routeDistance'

function DirectionsMap({ destination, onSuggestedKm }) {
  const embedUrl = getDirectionsEmbedUrl(destination)
  const openUrl = getGoogleMapsDirectionsUrl(destination)
  const [routeKm, setRouteKm] = useState(null)
  const [loadingDistance, setLoadingDistance] = useState(false)
  const [distanceError, setDistanceError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadDistance = async () => {
      setLoadingDistance(true)
      setDistanceError(false)
      setRouteKm(null)

      try {
        const km = await getDrivingDistanceKm(destination)
        if (cancelled) return

        if (km == null) {
          setDistanceError(true)
          return
        }

        setRouteKm(km)
        onSuggestedKm?.(km)
      } catch {
        if (!cancelled) setDistanceError(true)
      } finally {
        if (!cancelled) setLoadingDistance(false)
      }
    }

    loadDistance()

    return () => {
      cancelled = true
    }
  }, [destination, onSuggestedKm])

  const applySuggestedKm = () => {
    if (routeKm != null) onSuggestedKm?.(routeKm)
  }

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

      {(loadingDistance || routeKm != null || distanceError) && (
        <div className="directions-map__distance" aria-live="polite">
          {loadingDistance && <span>Calculating route distance…</span>}
          {!loadingDistance && routeKm != null && (
            <>
              <span>
                Road distance: <strong>{routeKm} km</strong>
                <small> (approx.)</small>
              </span>
              <button
                type="button"
                className="directions-map__use-km"
                onClick={applySuggestedKm}
              >
                Use {routeKm} km
              </button>
            </>
          )}
          {!loadingDistance && distanceError && (
            <span>Open in Google Maps to read the km on the route.</span>
          )}
        </div>
      )}

      <iframe
        key={embedUrl}
        title={`Directions from school to ${destination}`}
        src={embedUrl}
        className="directions-map__frame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <p className="directions-map__hint">
        The map zooms to the full route. Check the distance at the top of the map or use the
        <strong> {routeKm != null ? `${routeKm} km` : 'km'}</strong> shown above, then enter it in step 2.
      </p>
    </div>
  )
}

export default DirectionsMap
