import { Link, useSearchParams } from 'react-router-dom'
import schoolLogo from '../assets/school.png'
import OfficeGate from '../components/office/OfficeGate'
import OfficeTools from '../components/office/OfficeTools'
import LanguageTranslator from '../components/LanguageTranslator'
import { site } from '../data/siteData'
import './OfficePage.css'

function OfficePage() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const initialTab = tab === 'bus' ? 'bus' : tab === 'joy' ? 'joy' : 'admission'

  return (
    <div className="office-page">
      <header className="office-page__header">
        <div className="office-page__header-inner container">
          <div className="office-page__brand">
            <img src={schoolLogo} alt="" className="office-page__logo" />
            <strong>{site.name}</strong>
          </div>
          <div className="office-page__header-actions">
            <LanguageTranslator className="lang-translator--office" />
            <Link to="/" className="office-page__back">
              ← Back to website
            </Link>
          </div>
        </div>
      </header>

      <main className="office-page__main">
        <OfficeGate>
          <OfficeTools initialTab={initialTab} standalone />
        </OfficeGate>
      </main>
    </div>
  )
}

export default OfficePage
