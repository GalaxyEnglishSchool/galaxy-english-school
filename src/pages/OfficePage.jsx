import { Link, useSearchParams } from 'react-router-dom'
import schoolLogo from '../assets/school.png'
import OfficeTools from '../components/office/OfficeTools'
import { site } from '../data/siteData'
import './OfficePage.css'

function OfficePage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'bus' ? 'bus' : 'admission'

  return (
    <div className="office-page">
      <header className="office-page__header">
        <div className="office-page__header-inner container">
          <div className="office-page__brand">
            <img src={schoolLogo} alt="" className="office-page__logo" />
            <div>
              <strong>{site.name}</strong>
              <span>School Office Portal</span>
            </div>
          </div>
          <Link to="/" className="office-page__back">
            ← Back to website
          </Link>
        </div>
      </header>

      <main className="office-page__main">
        <OfficeTools initialTab={initialTab} standalone />
      </main>
    </div>
  )
}

export default OfficePage
