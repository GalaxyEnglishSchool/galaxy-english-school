import { useEffect, useState } from 'react'
import {
  getTranslateLanguage,
  initGoogleTranslate,
  setTranslateLanguage,
} from '../utils/googleTranslate'
import './LanguageTranslator.css'

function LanguageTranslator({ className = '', onClick }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLang(getTranslateLanguage())
    initGoogleTranslate()
  }, [])

  const handleClick = () => {
    const next = lang === 'mr' ? 'en' : 'mr'
    onClick?.()
    setTranslateLanguage(next)
  }

  const isMarathi = lang === 'mr'

  return (
    <button
      type="button"
      className={`lang-translator ${className}`.trim()}
      onClick={handleClick}
      title={isMarathi ? 'Switch back to English' : 'Translate website to Marathi'}
      aria-label={isMarathi ? 'Switch to English' : 'Translate to Marathi'}
    >
      <span className="lang-translator__icon" aria-hidden="true">🌐</span>
      <span className="lang-translator__label">{isMarathi ? 'English' : 'मराठी'}</span>
    </button>
  )
}

export default LanguageTranslator
