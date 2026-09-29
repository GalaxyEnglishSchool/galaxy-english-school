import { useState } from 'react'
import AdmissionAssessment from './AdmissionAssessment'
import BusFeesCalculator from './BusFeesCalculator'
import OfficeJoyAssistant from './OfficeJoyAssistant'
import './OfficeTools.css'

const NAV_ITEMS = [
  {
    id: 'admission',
    label: 'Assessment & Fees',
    hint: 'Admission test & scholarship',
    icon: '🎓',
  },
  {
    id: 'bus',
    label: 'Bus Fees',
    hint: 'Quotes by distance',
    icon: '🚌',
  },
  {
    id: 'joy',
    label: 'Joy Assistant',
    hint: 'Ask office questions',
    icon: '🙂',
  },
]

function OfficeTools({ initialTab = 'admission', standalone = false }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const Wrapper = standalone ? 'div' : 'section'
  const wrapperProps = standalone
    ? { className: 'office office--standalone' }
    : { id: 'office', className: 'office section section--alt' }

  return (
    <Wrapper {...wrapperProps}>
      <div className="container">
        <div className="office-shell">
          <nav className="office-nav" role="tablist" aria-label="Office tools">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeTab === item.id}
                className={`office-nav__btn${activeTab === item.id ? ' office-nav__btn--active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="office-nav__icon" aria-hidden="true">{item.icon}</span>
                <span className="office-nav__text">
                  <span className="office-nav__label">{item.label}</span>
                  <span className="office-nav__hint">{item.hint}</span>
                </span>
              </button>
            ))}
          </nav>

          <div className="office-shell__content" role="tabpanel">
            {activeTab === 'joy' && (
              <OfficeJoyAssistant onOpenTool={setActiveTab} />
            )}
            {activeTab === 'admission' && <AdmissionAssessment />}
            {activeTab === 'bus' && <BusFeesCalculator />}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default OfficeTools
