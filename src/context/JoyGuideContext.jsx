import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { JOY_INTRO_STORAGE_KEY, JOY_SECTION_IDS, joyGuideMessages } from '../data/joyGuideData'
import { useActiveSection } from '../hooks/useActiveSection'

const JoyGuideContext = createContext(null)

export function JoyGuideProvider({ children }) {
  const activeSection = useActiveSection(JOY_SECTION_IDS, 'home')
  const [introSeen, setIntroSeen] = useState(
    () => localStorage.getItem(JOY_INTRO_STORAGE_KEY) === '1',
  )

  const dismissIntro = useCallback(() => {
    localStorage.setItem(JOY_INTRO_STORAGE_KEY, '1')
    setIntroSeen(true)
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

  return (
    <JoyGuideContext.Provider value={{ activeSection, guide, isFirstVisit, dismissIntro }}>
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
