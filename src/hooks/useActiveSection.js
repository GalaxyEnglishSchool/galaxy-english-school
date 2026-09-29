import { useEffect, useState } from 'react'

function getSectionTop(element) {
  return element.getBoundingClientRect().top + window.scrollY
}

export function useActiveSection(sectionIds, fallback = 'home') {
  const [activeSection, setActiveSection] = useState(fallback)

  useEffect(() => {
    let frame = null
    let retryTimer = null
    let cancelled = false

    const update = () => {
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollMarker = window.scrollY + viewHeight * 0.38

      let current = fallback

      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (!element) return

        if (getSectionTop(element) <= scrollMarker) {
          current = id
        }
      })

      setActiveSection(current)
    }

    const scheduleUpdate = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    retryTimer = window.setInterval(() => {
      if (cancelled) return
      update()
    }, 400)

    return () => {
      cancelled = true
      if (frame) window.cancelAnimationFrame(frame)
      if (retryTimer) window.clearInterval(retryTimer)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sectionIds, fallback])

  return activeSection
}
