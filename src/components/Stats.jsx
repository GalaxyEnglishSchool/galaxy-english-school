import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/siteData'
import { useCountUp } from '../hooks/useCountUp'
import './Stats.css'

function StatItem({ item }) {
  const ref = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const displayValue = useCountUp(item.value, isActive)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="stats__item">
      <span className="stats__value">{displayValue}</span>
      <span className="stats__label">{item.label}</span>
    </div>
  )
}

function Stats() {
  return (
    <section className="stats" aria-label="School achievements">
      <div className="container stats__grid">
        {stats.map((item, index) => (
          <div key={item.label} className="stats__wrapper" style={{ '--stat-delay': `${index * 100}ms` }}>
            <StatItem item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
