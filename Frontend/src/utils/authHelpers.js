import { ROLES } from './constants.js'

export function isDoctor(user) {
  return String(user?.role).toLowerCase() === ROLES.DOCTOR
}

export function isPatient(user) {
  return String(user?.role).toLowerCase() === ROLES.PATIENT
}
