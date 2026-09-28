function ProgressIcon({ icon, label, percent, sublabel, tone = 'primary' }) {
  const safePercent = Math.min(100, Math.max(0, percent))

  return (
    <div className={`office-progress-item office-progress-item--${tone}`}>
      <div
        className="office-progress-ring"
        style={{ '--progress': safePercent }}
        role="img"
        aria-label={`${label}: ${safePercent}%`}
      >
        <div className="office-progress-ring__inner">
          <span className="office-progress-ring__icon" aria-hidden="true">{icon}</span>
        </div>
      </div>
      <div className="office-progress-item__text">
        <span className="office-progress-item__label">{label}</span>
        <strong className="office-progress-item__value">{safePercent}%</strong>
        {sublabel && <small className="office-progress-item__sub">{sublabel}</small>}
      </div>
    </div>
  )
}

export default ProgressIcon
