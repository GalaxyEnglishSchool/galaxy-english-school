import { useEffect, useState } from 'react'

function parseStatValue(value) {
  const match = value.match(/([\d,]+)(.*)/)
  if (!match) return { number: 0, suffix: value }

  return {
    number: Number.parseInt(match[1].replace(/,/g, ''), 10),
    suffix: match[2],
  }
}

export function useCountUp(value, isActive, duration = 1600) {
  const { number, suffix } = parseStatValue(value)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isActive) return undefined

    let start = 0
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = Math.round(start + (number - start) * eased)
      setDisplay(current)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
    return undefined
  }, [isActive, number, duration])

  const formatted = display.toLocaleString()
  return `${formatted}${suffix}`
}
