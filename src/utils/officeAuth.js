const OFFICE_SESSION_KEY = 'ges-office-unlocked'
const OFFICE_PASSWORD = 'Galaxy@1970'

export function isOfficeUnlocked() {
  return sessionStorage.getItem(OFFICE_SESSION_KEY) === '1'
}

export function unlockOffice(password) {
  if (password !== OFFICE_PASSWORD) return false
  sessionStorage.setItem(OFFICE_SESSION_KEY, '1')
  return true
}

export function lockOffice() {
  sessionStorage.removeItem(OFFICE_SESSION_KEY)
}
