import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  clearOfficeStudentPacket,
  loadOfficeStudentPacket,
  saveOfficeStudentPacket,
} from '../utils/officeStudentSession'

const OfficeStudentContext = createContext(null)

export function OfficeStudentProvider({ children }) {
  const [packet, setPacket] = useState(() => loadOfficeStudentPacket())

  const setAdmission = useCallback((admission) => {
    setPacket((prev) => saveOfficeStudentPacket({ ...prev, admission }))
  }, [])

  const setAdmissionDraft = useCallback((admissionDraft) => {
    setPacket((prev) => saveOfficeStudentPacket({ ...prev, admissionDraft }))
  }, [])

  const setWalkIn = useCallback((walkIn) => {
    setPacket((prev) => saveOfficeStudentPacket({ ...prev, walkIn }))
  }, [])

  const setBus = useCallback((bus) => {
    setPacket((prev) => saveOfficeStudentPacket({ ...prev, bus }))
  }, [])

  const clearPacket = useCallback(() => {
    setPacket(clearOfficeStudentPacket())
  }, [])

  const value = useMemo(
    () => ({
      admission: packet.admission,
      admissionDraft: packet.admissionDraft,
      walkIn: packet.walkIn,
      bus: packet.bus,
      updatedAt: packet.updatedAt,
      setAdmission,
      setAdmissionDraft,
      setWalkIn,
      setBus,
      clearPacket,
      hasAdmission: Boolean(packet.admission?.applicationId),
      hasWalkIn: Boolean(packet.walkIn?.applicationId),
      hasBus: Boolean(packet.bus?.distanceKm && packet.bus?.monthlyTotal != null),
    }),
    [packet, setAdmission, setAdmissionDraft, setWalkIn, setBus, clearPacket],
  )

  return (
    <OfficeStudentContext.Provider value={value}>
      {children}
    </OfficeStudentContext.Provider>
  )
}

export function useOfficeStudent() {
  const ctx = useContext(OfficeStudentContext)
  if (!ctx) {
    throw new Error('useOfficeStudent must be used within OfficeStudentProvider')
  }
  return ctx
}
