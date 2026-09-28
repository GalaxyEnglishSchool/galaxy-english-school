const COOKIE_NAME = 'googtrans'

export function getTranslateLanguage() {
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) return 'en'
  const parts = match[1].split('/')
  return parts[2] === 'mr' ? 'mr' : 'en'
}

export function setTranslateLanguage(lang) {
  const value = lang === 'mr' ? '/en/mr' : '/en/en'
  const { hostname } = window.location

  document.cookie = `${COOKIE_NAME}=${value}; path=/`
  if (hostname && hostname !== 'localhost') {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=${hostname}`
  }

  window.location.reload()
}

export function initGoogleTranslate() {
  if (window.__gesTranslateReady) {
    return Promise.resolve()
  }

  if (window.__gesTranslateLoading) {
    return window.__gesTranslateLoading
  }

  window.__gesTranslateLoading = new Promise((resolve) => {
    const mount = () => {
      if (!window.google?.translate?.TranslateElement) {
        resolve()
        return
      }

      const container = document.getElementById('google_translate_element')
      if (container && !container.dataset.initialized) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,mr',
            autoDisplay: false,
          },
          'google_translate_element',
        )
        container.dataset.initialized = 'true'
      }

      window.__gesTranslateReady = true
      resolve()
    }

    if (window.google?.translate?.TranslateElement) {
      mount()
      return
    }

    window.googleTranslateElementInit = mount

    const existing = document.querySelector('script[data-ges-translate]')
    if (existing) return

    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.dataset.gesTranslate = 'true'
    script.onerror = () => resolve()
    document.body.appendChild(script)
  })

  return window.__gesTranslateLoading
}
