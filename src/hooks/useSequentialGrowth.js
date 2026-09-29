import { useEffect, useState } from 'react'

/**
 * Increments step from 0 up to count while active.
 * Each step reveals the next tree section.
 */
export function useSequentialGrowth(count, active, intervalMs = 820) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    if (step >= count) return undefined

    const delay = step === 0 ? 280 : intervalMs
    const timer = window.setTimeout(() => {
      setStep((current) => current + 1)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [active, step, count, intervalMs])

  return step
}
