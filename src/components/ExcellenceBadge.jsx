import badgeImg from '../assets/18 Years of Excellence Badge.png'
import './ExcellenceBadge.css'

function ExcellenceBadge() {
  return (
    <aside className="excellence-badge" aria-label="18 years of excellence">
      <img
        src={badgeImg}
        alt="18 Years of Excellence"
        className="excellence-badge__img"
        width={200}
        height={200}
        decoding="async"
        loading="lazy"
      />
    </aside>
  )
}

export default ExcellenceBadge