import client from './client.js'

/** GET /patient/profile/ */
export function getPatientProfile() {
  return client.get('patient/profile/')
}

/** PUT /patient/profile/update/ */
export function updatePatientProfile(payload) {
  return client.put('patient/profile/update/', payload)
}

/** GET /patient/history/ */
export function getPatientHistory() {
  return client.get('patient/history/')
}

/** GET /patient/reports/ */
export function getPatientReports() {
  return client.get('patient/reports/')
}
