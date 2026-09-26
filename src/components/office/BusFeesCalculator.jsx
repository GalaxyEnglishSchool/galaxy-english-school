import { useMemo, useState } from 'react'
import {
  busDistanceSlabs,
  busFeeOptions,
  getBusFeeForDistance,
  gradeFees,
} from '../../data/admissionData'
import { schoolOrigin } from '../../utils/busDistance'
import { formatINR } from '../../utils/formatCurrency'
import { openWhatsApp } from '../../utils/whatsapp'
import { site } from '../../data/siteData'
import DirectionsMap from './DirectionsMap'
import './BusFees.css'

function BusFeesCalculator() {
  const [studentName, setStudentName] = useState('')
  const [gradeId, setGradeId] = useState('std1')
  const [destination, setDestination] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [distanceKm, setDistanceKm] = useState('')
  const [termId, setTermId] = useState('monthly')
  const [tripId, setTripId] = useState('twice')
  const [siblingDiscount, setSiblingDiscount] = useState(false)
  const [parentPhone, setParentPhone] = useState('')

  const selectedTerm = busFeeOptions.terms.find((term) => term.id === termId)
  const selectedTrip = busFeeOptions.tripOptions.find((trip) => trip.id === tripId)
  const selectedGrade = gradeFees.find((grade) => grade.id === gradeId)

  const parsedKm = distanceKm ? Number(distanceKm) : null
  const hasValidKm = parsedKm != null && !Number.isNaN(parsedKm) && parsedKm > 0
  const feeSlab = hasValidKm ? getBusFeeForDistance(parsedKm) : null

  const calculation = useMemo(() => {
    const slabMonthly = feeSlab?.monthlyFee ?? 0
    const tripPercent = selectedTrip?.feePercent ?? 100
    const monthly = Math.round((slabMonthly * tripPercent) / 100)
    const months = selectedTerm?.months ?? 1
    const subtotal = monthly * months
    const discount = siblingDiscount
      ? Math.round((subtotal * busFeeOptions.siblingDiscountPercent) / 100)
      : 0
    const total = subtotal - discount
    return { slabMonthly, tripPercent, monthly, months, subtotal, discount, total }
  }, [feeSlab, selectedTerm, selectedTrip, siblingDiscount])

  const activeSlabIndex = feeSlab
    ? busDistanceSlabs.findIndex((s) => s.label === feeSlab.label)
    : -1

  const showRoute = () => {
    if (!destination.trim()) return
    setShowMap(true)
  }

  const sendWhatsAppQuote = () => {
    const message = `🚌 ${site.name} — Bus Fee Quote

Student: ${studentName || '—'}
Class: ${selectedGrade?.label ?? '—'}
Pickup: ${destination || '—'}
School: ${schoolOrigin.address}
Distance: ${parsedKm ? `${parsedKm} km` : '—'}
Fee slab: ${feeSlab?.label ?? '—'}
Trip: ${selectedTrip?.label ?? '—'} (${selectedTrip?.feePercent ?? 100}% of slab rate)
Billing: ${selectedTerm?.label ?? '—'}
${siblingDiscount ? `Sibling discount: ${busFeeOptions.siblingDiscountPercent}% (-${formatINR(calculation.discount)})` : ''}

Slab monthly: ${formatINR(calculation.slabMonthly)}
Monthly fee (${selectedTrip?.feePercent}%): ${formatINR(calculation.monthly)}
Amount due: ${formatINR(calculation.total)}

Contact: ${parentPhone || '—'}

${site.name}, ${site.location}`

    openWhatsApp(message)
  }

  return (
    <div className="bus-fees">
      <header className="bus-fees__hero">
        <div className="bus-fees__hero-text">
          <span className="bus-fees__hero-icon" aria-hidden="true">🚌</span>
          <div>
            <h3>Bus Fee Calculator</h3>
            <p>Route by distance from school → home. View map, enter km, get instant quote.</p>
          </div>
        </div>
      </header>

      <div className="bus-fees__layout">
        <div className="bus-fees__main">
          {/* Route timeline */}
          <section className="bus-card">
            <h4 className="bus-card__title">
              <span className="bus-card__step">1</span>
              Route
            </h4>
            <div className="bus-route">
              <div className="bus-route__point bus-route__point--from">
                <div className="bus-route__dot" />
                <div className="bus-route__content">
                  <span className="bus-route__label">Pickup from school</span>
                  <strong>{schoolOrigin.label}</strong>
                  <small>{schoolOrigin.address}</small>
                </div>
              </div>
              <div className="bus-route__line" aria-hidden="true">
                <span className="bus-route__bus">🚌</span>
              </div>
              <div className="bus-route__point bus-route__point--to">
                <div className="bus-route__dot bus-route__dot--home" />
                <div className="bus-route__content">
                  <span className="bus-route__label">Drop at student home</span>
                  <label className="bus-field bus-field--full">
                    <span className="bus-field__label">Home / pickup address</span>
                    <input
                      type="text"
                      className="bus-field__input"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value)
                        setShowMap(false)
                      }}
                      placeholder="e.g. CIDCO N-4, Chh. Sambhajinagar"
                    />
                  </label>
                  <button
                    type="button"
                    className="bus-btn bus-btn--map"
                    disabled={!destination.trim()}
                    onClick={showRoute}
                  >
                    <span aria-hidden="true">🗺️</span>
                    Show route on map
                  </button>
                </div>
              </div>
            </div>

            {showMap && destination.trim() && (
              <DirectionsMap destination={destination.trim()} />
            )}
          </section>

          {/* Student details */}
          <section className="bus-card">
            <h4 className="bus-card__title">
              <span className="bus-card__step">2</span>
              Student details
            </h4>
            <div className="bus-fields">
              <label className="bus-field">
                <span className="bus-field__label">Student name</span>
                <input
                  type="text"
                  className="bus-field__input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="For WhatsApp quote"
                />
              </label>
              <label className="bus-field">
                <span className="bus-field__label">Class</span>
                <select
                  className="bus-field__input"
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value)}
                >
                  {gradeFees.map((grade) => (
                    <option key={grade.id} value={grade.id}>{grade.label}</option>
                  ))}
                </select>
              </label>
              <label className="bus-field">
                <span className="bus-field__label">Parent WhatsApp</span>
                <input
                  type="tel"
                  className="bus-field__input"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="10-digit mobile"
                />
              </label>
            </div>
          </section>

          {/* Distance */}
          <section className="bus-card">
            <h4 className="bus-card__title">
              <span className="bus-card__step">3</span>
              Distance & fee slab
            </h4>
            <p className="bus-card__hint">
              Read the road distance (km) from the map above and enter it here.
            </p>

            <div className="bus-distance-input">
              <input
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

            <div className="bus-slabs">
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

          {/* Trip & billing */}
          <section className="bus-card">
            <h4 className="bus-card__title">
              <span className="bus-card__step">4</span>
              Trip & billing
            </h4>

            <p className="bus-card__hint bus-card__hint--tight">How many times per day will the student use the bus?</p>
            <div className="bus-trip-options" role="group" aria-label="Daily bus trips">
              {busFeeOptions.tripOptions.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  className={`bus-trip-option${tripId === trip.id ? ' bus-trip-option--active' : ''}`}
                  onClick={() => setTripId(trip.id)}
                >
                  <span className="bus-trip-option__label">{trip.label}</span>
                  <span className="bus-trip-option__percent">{trip.feePercent}% fee</span>
                  <span className="bus-trip-option__desc">{trip.description}</span>
                </button>
              ))}
            </div>

            <p className="bus-card__hint bus-card__hint--tight">Billing period</p>
            <div className="bus-pills" role="group" aria-label="Billing period">
              {busFeeOptions.terms.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  className={`bus-pill${termId === term.id ? ' bus-pill--active' : ''}`}
                  onClick={() => setTermId(term.id)}
                >
                  {term.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`bus-toggle${siblingDiscount ? ' bus-toggle--on' : ''}`}
              onClick={() => setSiblingDiscount((v) => !v)}
              aria-pressed={siblingDiscount}
            >
              <span className="bus-toggle__track">
                <span className="bus-toggle__thumb" />
              </span>
              <span>
                Sibling discount ({busFeeOptions.siblingDiscountPercent}%)
              </span>
            </button>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className="bus-fees__summary">
          <div className="bus-summary">
            <div className="bus-summary__header">
              <span>Fee summary</span>
              {feeSlab && (
                <span className="bus-summary__slab">{feeSlab.label}</span>
              )}
            </div>

            <div className="bus-summary__total-wrap">
              <span className="bus-summary__total-label">Total bus fee</span>
              <div className="bus-summary__total">
                {feeSlab ? formatINR(calculation.total) : '—'}
              </div>
              {feeSlab && (
                <span className="bus-summary__period">{selectedTerm?.label}</span>
              )}
            </div>

            <ul className="bus-summary__lines">
              <li>
                <span>Slab rate</span>
                <strong>{feeSlab ? formatINR(calculation.slabMonthly) : '—'}</strong>
              </li>
              <li>
                <span>Trip ({selectedTrip?.label})</span>
                <strong>{selectedTrip?.feePercent}%</strong>
              </li>
              <li>
                <span>Monthly rate</span>
                <strong>{feeSlab ? formatINR(calculation.monthly) : '—'}</strong>
              </li>
              <li>
                <span>Distance</span>
                <strong>{hasValidKm ? `${parsedKm} km` : '—'}</strong>
              </li>
              <li>
                <span>Duration</span>
                <strong>{calculation.months} mo</strong>
              </li>
              <li>
                <span>Subtotal</span>
                <strong>{feeSlab ? formatINR(calculation.subtotal) : '—'}</strong>
              </li>
              {siblingDiscount && feeSlab && (
                <li className="bus-summary__discount">
                  <span>Sibling discount</span>
                  <strong>- {formatINR(calculation.discount)}</strong>
                </li>
              )}
            </ul>

            <button
              type="button"
              className="btn btn--whatsapp btn--full bus-summary__whatsapp"
              disabled={!feeSlab}
              onClick={sendWhatsAppQuote}
            >
              Send quote on WhatsApp
            </button>

            {!feeSlab && (
              <p className="bus-summary__empty">
                Enter home address and distance to see the fee quote.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BusFeesCalculator
