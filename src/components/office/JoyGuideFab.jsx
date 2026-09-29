import joyStanding from '../../assets/joy-standing.png'
import './JoyGuideFab.css'

function JoyGuideFab({ onClick, hidden = false, label = 'Show Joy guide' }) {
  if (hidden) return null

  return (
    <button
      type="button"
      className="joy-guide-fab"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <img src={joyStanding} alt="" className="joy-guide-fab__image" />
      <span className="joy-guide-fab__label">Guide</span>
    </button>
  )
}

export default JoyGuideFab
