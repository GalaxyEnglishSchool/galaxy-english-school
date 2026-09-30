import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { JOY_INTRO_STORAGE_KEY, JOY_SECTION_IDS, joyGuideMessages } from '../data/joyGuideData'
import { useActiveSection } from '../hooks/useActiveSection'

const JoyGuideContext = createContext(null)

const HERO_PAST_THRESHOLD = 0.32
const HERO_RETURN_THRESHOLD = 0.38

export function JoyGuideProvider({ children }) {
  const activeSection = useActiveSection(JOY_SECTION_IDS, 'home')
  const [introSeen, setIntroSeen] = useState(
    () => localStorage.getItem(JOY_INTRO_STORAGE_KEY) === '1',
  )
  const [heroEntrancePlayed, setHeroEntrancePlayed] = useState(false)
  const [siteTourActive, setSiteTourActive] = useState(false)
  const [pastHero, setPastHero] = useState(false)

  const dismissIntro = useCallback(() => {
    localStorage.setItem(JOY_INTRO_STORAGE_KEY, '1')
    setIntroSeen(true)
  }, [])

  const markHeroEntrancePlayed = useCallback(() => {
    setHeroEntrancePlayed(true)
  }, [])

  const startSiteTour = useCallback(() => {
    setSiteTourActive(true)
    setHeroEntrancePlayed(true)
    if (!introSeen) {
      localStorage.setItem(JOY_INTRO_STORAGE_KEY, '1')
      setIntroSeen(true)
    }
  }, [introSeen])

  const endSiteTour = useCallback(() => {
    setSiteTourActive(false)
  }, [])

  useEffect(() => {
    if (!pastHero || window.scrollY < 120) return undefined
    setHeroEntrancePlayed(true)
    return undefined
  }, [pastHero])

  useEffect(() => {
    let frame = null
    let ready = false

    const updatePastHero = () => {
      if (!ready) return

      const home = document.getElementById('home')
      if (!home) return

      const bottomRatio = home.getBoundingClientRect().bottom / window.innerHeight

      setPastHero((prev) => {
        if (!prev && bottomRatio < HERO_PAST_THRESHOLD && window.scrollY > 48) return true
        if (prev && bottomRatio > HERO_RETURN_THRESHOLD) return false
        return prev
      })
    }

    const scheduleUpdate = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updatePastHero)
    }

    const readyTimer = window.setTimeout(() => {
      ready = true
      updatePastHero()
    }, 350)

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.clearTimeout(readyTimer)
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  useEffect(() => {
    if (introSeen || activeSection === 'home') return undefined
    dismissIntro()
    return undefined
  }, [activeSection, introSeen, dismissIntro])

  const isFirstVisit = !introSeen

  const guide = useMemo(() => {
    if (activeSection === 'home' && isFirstVisit) {
      return joyGuideMessages.homeFirstVisit
    }
    return joyGuideMessages[activeSection] ?? joyGuideMessages.home
  }, [activeSection, isFirstVisit])

  const value = useMemo(() => ({
    activeSection,
    pastHero,
    guide,
    isFirstVisit,
    dismissIntro,
    heroEntrancePlayed,
    markHeroEntrancePlayed,
    siteTourActive,
    startSiteTour,
    endSiteTour,
  }), [
    activeSection,
    pastHero,
    guide,
    isFirstVisit,
    dismissIntro,
    heroEntrancePlayed,
    markHeroEntrancePlayed,
    siteTourActive,
    startSiteTour,
    endSiteTour,
  ])

  return (
    <JoyGuideContext.Provider value={value}>
      {children}
    </JoyGuideContext.Provider>
  )
}

export function useJoyGuide() {
  const context = useContext(JoyGuideContext)
  if (!context) {
    throw new Error('useJoyGuide must be used within JoyGuideProvider')
  }
  return context
}
