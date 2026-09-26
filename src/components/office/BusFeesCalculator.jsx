import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  busDistanceSlabs,
  busFeeOptions,
  busFeeRules,
  busServiceHighlights,
  getBusFeeForDistance,
} from '../../data/admissionData'
import schoolBusImg from '../../assets/SchoolBus.jpg'
import { schoolOrigin } from '../../utils/busDistance'
import { formatINR } from '../../utils/formatCurrency'
import { openWhatsApp } from '../../utils/whatsapp'
import { site } from '../../data/siteData'
import DirectionsMap from './DirectionsMap'
import './BusFees.css'

function BusFeesCalculator() {
  const [destination, setDestination] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [distanceKm, setDistanceKm] = useState('')
  const [tripId, setTripId] = useState('twice')
  const [siblingDiscount, setSiblingDiscount] = useState(false)

  const selectedTrip = busFeeOptions.tripOptions.find((trip) => trip.id === tripId)

  const parsedKm = distanceKm ? Number(distanceKm) : null
  const hasValidKm = parsedKm != null && !Number.isNaN(parsedKm) && parsedKm > 0
  const feeSlab = hasValidKm ? getBusFeeForDistance(parsedKm) : null

  const calculation = useMemo(() => {
    const slabMonthly = feeSlab?.monthlyFee ?? 0
    const tripPercent = selectedTrip?.feePercent ?? 100
    const monthly = Math.round((slabMonthly * tripPercent) / 100)
    const discount = siblingDiscount
      ? Math.round((monthly * busFeeOptions.siblingDiscountPercent) / 100)
      : 0
    const total = monthly - discount
    return { slabMonthly, tripPercent, monthly, discount, total }
  }, [feeSlab, selectedTrip, siblingDiscount])

  const activeSlabIndex = feeSlab
    ? busDistanceSlabs.findIndex((s) => s.label === feeSlab.label)
    : -1

  const handleSuggestedKm = useCallback((km) => {
    setDistanceKm(String(km))
  }, [])

  const showRoute = () => {
    if (!destination.trim()) return
    setShowMap(true)
  }

  useEffect(() => {
    const trimmed = destination.trim()
    if (!trimmed || trimmed.length < 5) {
      setShowMap(false)
      return undefined
    }

    const timer = window.setTimeout(() => setShowMap(true), 700)
    return () => window.clearTimeout(timer)
  }, [destination])

  const sendWhatsAppQuote = () => {
    const rulesText = busFeeRules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')
    const highlightsText = busServiceHighlights.map((h) => `✓ ${h.title}`).join('\n')

    const message = `🚌 ${site.name} — Bus Fee Report

Our buses: GPS enabled · Proper maintenance · Clean & hygienic

Pickup: ${destination || '—'}
Distance: ${parsedKm ? `${parsedKm} km` : '—'}
Fee slab: ${feeSlab?.label ?? '—'}
Daily trips: ${selectedTrip?.label ?? '—'} (${selectedTrip?.feePercent ?? 100}% of slab)
${siblingDiscount ? `Sibling discount: ${busFeeOptions.siblingDiscountPercent}% (-${formatINR(calculation.discount)})` : ''}

Slab rate: ${formatINR(calculation.slabMonthly)}/month
Monthly bus fee: ${formatINR(calculation.total)}/month

${highlightsText}

Rules:
${rulesText}

${site.name}, ${site.location}`

    openWhatsApp(message)
  }

  return (
    <div className="bus-fees">
      <header className="bus-fees__header">
        <img
          src={schoolBusImg}
          alt=""
          className="bus-fees__thumb"
          aria-hidden="true"
        />
        <div className="bus-fees__header-text">
          <h3>Bus Fee Calculator</h3>
          <p>Location · distance · fee report — all on one page</p>
        </div>
        <ul className="bus-fees__chips" aria-label="Bus service features">
          {busServiceHighlights.map((item) => (
            <li key={item.title}>
              <span aria-hidden="true">{item.icon}</span> {item.title}
            </li>
          ))}
        </ul>
      </header>

      <div className="bus-fees__layout">
        <section className="bus-fees__panel bus-fees__panel--inputs" aria-label="Route details">
          <h4 className="bus-fees__panel-title">Pickup &amp; distance</h4>

          <div className="bus-route-compact">
            <div className="bus-route-compact__from">
              <span>🏫</span>
              <div>
                <strong>{schoolOrigin.label}</strong>
                <small>{schoolOrigin.address}</small>
              </div>
            </div>
            <div className="bus-route-compact__arrow">↓</div>
            <label className="bus-field bus-field--full">
              <span className="bus-field__label">Student home address</span>
              <input
                type="text"
                className="bus-field__input"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    showRoute()
                  }
                }}
                placeholder="e.g. CIDCO N-4, Chh. Sambhajinagar"
              />
            </label>
          </div>

          <button
            type="button"
            className="bus-btn bus-btn--map bus-btn--full"
            disabled={!destination.trim()}
            onClick={showRoute}
          >
            🗺️ Show route on map
          </button>

          {showMap && destination.trim() && (
            <DirectionsMap
              destination={destination.trim()}
              onSuggestedKm={handleSuggestedKm}
            />
          )}

          <div className="bus-fees__distance-block">
            <label className="bus-fees__distance-label" htmlFor="bus-distance-km">
              Road distance from map
            </label>
            <div className="bus-distance-input">
              <input
                id="bus-distance-km"
                type="number"
                min="0"
                step="0.1"
                className="bus-distance-input__field"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="0"
                aria-label="Road distance in kilometres"
              />
              <span className="bus-distance-input__unit">km</span>
            </div>
          </div>

          <div className="bus-slabs bus-slabs--compact">
            {busDistanceSlabs.map((slab, index) => (
              <div
                key={slab.label}
                className={[
                  'bus-slab',
                  index === activeSlabIndex ? 'bus-slab--active' : '',
                ].filter(Boolean).join(' ')}
              >
                <span className="bus-slab__range">{slab.label}</span>
                <span className="bus-slab__fee">{formatINR(slab.monthlyFee)}/mo</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bus-fees__panel bus-fees__panel--report" aria-label="Fee report">
          <h4 className="bus-fees__panel-title">Fee report</h4>

          <div className="bus-report__route bus-report__route--compact">
            <div className="bus-report__timeline">
              <div className="bus-report__stop">
                <span className="bus-report__dot bus-report__dot--school" aria-hidden="true">🏫</span>
                <div>
                  <span className="bus-report__stop-label">School</span>
                  <span className="bus-report__stop-name">{schoolOrigin.label}</span>
                </div>
              </div>
              <div className="bus-report__line" aria-hidden="true">
                <span className="bus-report__line-bus">🚌</span>
                <span className="bus-report__line-km">
                  {hasValidKm ? `${parsedKm} km` : '— km'}
                </span>
              </div>
              <div className="bus-report__stop">
                <span className="bus-report__dot bus-report__dot--home" aria-hidden="true">🏠</span>
                <div>
                  <span className="bus-report__stop-label">Pickup</span>
                  <span className="bus-report__stop-name">{destination.trim() || 'Enter address'}</span>
                </div>
              </div>
            </div>
            {feeSlab && (
              <span className="bus-report__slab-pill">{feeSlab.label} slab</span>
            )}
          </div>

          <div className="bus-report__section">
            <p className="bus-report__section-label">Daily trips</p>
            <div className="bus-trip-options" role="group" aria-label="Daily bus trips">
              {busFeeOptions.tripOptions.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  className={`bus-trip-option${tripId === trip.id ? ' bus-trip-option--active' : ''}`}
                  onClick={() => setTripId(trip.id)}
                >
                  <span className="bus-trip-option__label">{trip.label}</span>
                  <span className="bus-trip-option__percent">{trip.feePercent}%</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`bus-toggle bus-report__sibling${siblingDiscount ? ' bus-toggle--on' : ''}`}
            onClick={() => setSiblingDiscount((v) => !v)}
            aria-pressed={siblingDiscount}
          >
            <span className="bus-toggle__track"><span className="bus-toggle__thumb" /></span>
            <span>Sibling discount ({busFeeOptions.siblingDiscountPercent}%)</span>
          </button>

          <div className={`bus-report__amount${!hasValidKm ? ' bus-report__amount--empty' : ''}`}>
            <span className="bus-report__amount-label">Monthly bus fee</span>
            <div className="bus-report__amount-value">
              {hasValidKm ? formatINR(calculation.total) : '—'}
            </div>
            <span className="bus-report__amount-note">
              {hasValidKm
                ? `per month · ${selectedTrip?.label} trip`
                : 'Enter distance to calculate fee'}
            </span>
          </div>

          {hasValidKm && (
            <ul className="bus-report__breakdown">
              <li>
                <span>Distance slab rate</span>
                <strong>{formatINR(calculation.slabMonthly)}/mo</strong>
              </li>
              <li>
                <span>Trip ({selectedTrip?.label})</span>
                <strong>{selectedTrip?.feePercent}%</strong>
              </li>
              <li>
                <span>Before discount</span>
                <strong>{formatINR(calculation.monthly)}/mo</strong>
              </li>
              {siblingDiscount && (
                <li className="bus-report__breakdown--discount">
                  <span>Sibling discount</span>
                  <strong>- {formatINR(calculation.discount)}</strong>
                </li>
              )}
            </ul>
          )}

          <div className="bus-report__rules">
            <h5 className="bus-report__rules-title">
              <span aria-hidden="true">📋</span> Fee rules &amp; conditions
            </h5>
            <ol className="bus-report__rules-list">
              {busFeeRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            className="btn btn--whatsapp btn--full bus-fees__whatsapp"
            disabled={!hasValidKm}
            onClick={sendWhatsAppQuote}
          >
            Send on WhatsApp
          </button>
        </section>
      </div>
    </div>
  )
}

export default BusFeesCalculator
