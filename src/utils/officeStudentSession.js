/** One-student office workflow: assessment + bus → print (per browser tab). */
const STORAGE_KEY = 'ges-office-student-packet'

export const defaultAdmissionDraft = () => ({
  step: 1,
  applicationId: '',
  questionIndex: 0,
  answers: {},
  siblingDiscount: false,
  student: {
    name: '',
    dob: '',
    gradeId: 'std1',
    parentName: '',
    parentPhone: '',
  },
})

export function loadOfficeStudentPacket() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { admission: null, admissionDraft: null, walkIn: null, bus: null, updatedAt: null }
    }
    const parsed = JSON.parse(raw)
    return {
      admission: parsed.admission ?? null,
      admissionDraft: parsed.admissionDraft ?? null,
      walkIn: parsed.walkIn ?? null,
      bus: parsed.bus ?? null,
      updatedAt: parsed.updatedAt ?? null,
    }
  } catch {
    return { admission: null, admissionDraft: null, walkIn: null, bus: null, updatedAt: null }
  }
}

export function saveOfficeStudentPacket(packet) {
  const next = {
    admission: packet.admission ?? null,
    admissionDraft: packet.admissionDraft ?? null,
    walkIn: packet.walkIn ?? null,
    bus: packet.bus ?? null,
    updatedAt: new Date().toISOString(),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearOfficeStudentPacket() {
  sessionStorage.removeItem(STORAGE_KEY)
  return { admission: null, admissionDraft: null, walkIn: null, bus: null, updatedAt: null }
}
