import { useEffect, useState } from 'react'

function getSectionTop(element) {
  return element.getBoundingClientRect().top + window.scrollY
}

export function useActiveSection(sectionIds, fallback = 'home') {
  const [activeSection, setActiveSection] = useState(fallback)

  useEffect(() => {
    let frame = null
    let cancelled = false

    const update = () => {
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollMarker = window.scrollY + viewHeight * 0.38

      let current = fallback

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) continue

        if (getSectionTop(element) <= scrollMarker) {
          current = id
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const scheduleUpdate = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    // Re-check after lazy sections mount — no continuous polling
    const retryTimers = [400, 1200, 2500].map((delay) =>
      window.setTimeout(() => {
        if (!cancelled) update()
      }, delay),
    )

    return () => {
      cancelled = true
      if (frame) window.cancelAnimationFrame(frame)
      retryTimers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sectionIds, fallback])

  return activeSection
}
