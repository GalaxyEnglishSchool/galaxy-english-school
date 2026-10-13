import { useState } from 'react'
import { OfficeStudentProvider } from '../../context/OfficeStudentContext'
import AdmissionAssessment from './AdmissionAssessment'
import BusFeesCalculator from './BusFeesCalculator'
import OfficePrintSummary from './OfficePrintSummary'
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
    id: 'print',
    label: 'Print / PDF',
    hint: 'Combined parent summary',
    icon: '📄',
  },
]

const OFFICE_TAB_IDS = new Set(NAV_ITEMS.map((item) => item.id))

function OfficeTools({ initialTab = 'admission', standalone = false }) {
  const [activeTab, setActiveTab] = useState(
    () => (OFFICE_TAB_IDS.has(initialTab) ? initialTab : 'admission'),
  )

  const Wrapper = standalone ? 'div' : 'section'
  const wrapperProps = standalone
    ? { className: 'office office--standalone' }
    : { id: 'office', className: 'office section section--alt' }

  return (
    <Wrapper {...wrapperProps}>
      <div className="container">
        <OfficeStudentProvider>
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
            <div
              className="office-tab-panel"
              hidden={activeTab !== 'admission'}
              aria-hidden={activeTab !== 'admission'}
            >
              <AdmissionAssessment onOpenTool={setActiveTab} />
            </div>
            <div
              className="office-tab-panel"
              hidden={activeTab !== 'bus'}
              aria-hidden={activeTab !== 'bus'}
            >
              <BusFeesCalculator />
            </div>
            {activeTab === 'print' && <OfficePrintSummary onOpenTool={setActiveTab} />}
          </div>
        </div>
        </OfficeStudentProvider>
      </div>
    </Wrapper>
  )
}

export default OfficeTools
