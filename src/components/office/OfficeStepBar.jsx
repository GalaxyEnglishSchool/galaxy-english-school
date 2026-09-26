function OfficeStepBar({ steps, currentStep }) {
  return (
    <div className="office-stepbar" aria-label="Progress steps">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isActive = currentStep === stepNum
        const isDone = currentStep > stepNum

        return (
          <div
            key={label}
            className={[
              'office-stepbar__item',
              isActive ? 'office-stepbar__item--active' : '',
              isDone ? 'office-stepbar__item--done' : '',
            ].filter(Boolean).join(' ')}
          >
            <span className="office-stepbar__track" aria-hidden="true">
              <span className="office-stepbar__num">{stepNum}</span>
            </span>
            <span className="office-stepbar__label">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default OfficeStepBar
