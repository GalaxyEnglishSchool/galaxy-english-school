import { useReveal } from '../hooks/useReveal'

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useReveal()

  return (
    <div
      ref={ref}
      className={`reveal reveal--${direction} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default Reveal
