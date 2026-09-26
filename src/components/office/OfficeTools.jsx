import { useState } from 'react'
import AdmissionAssessment from './AdmissionAssessment'
import BusFeesCalculator from './BusFeesCalculator'
import './OfficeTools.css'

const TABS = [
  { id: 'admission', label: 'Assessment & Fees', icon: '🎓' },
  { id: 'bus', label: 'Bus Fees', icon: '🚌' },
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
        <div className="section-header">
          <span className="section-label">School Office</span>
          <h2 className="section-title">Assessment & fee tools</h2>
          <p className="section-subtitle section-subtitle--compact-mobile">
            Admission readiness test, scholarship calculation, and bus fee quotes
            by distance from school.
          </p>
        </div>

        <div className="office__badge">Office use only</div>

        <div className="office-tabs" role="tablist" aria-label="Office tools">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`office-tabs__btn${activeTab === tab.id ? ' office-tabs__btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="office-tabs__panel" role="tabpanel">
          {activeTab === 'admission' ? <AdmissionAssessment /> : <BusFeesCalculator />}
        </div>
      </div>
    </Wrapper>
  )
}

export default OfficeTools
