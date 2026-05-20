import client from './client.js'

/** GET /doctor/profile/ */
export function getDoctorProfile() {
  return client.get('doctor/profile/')
}

/** PUT /doctor/profile/update/ */
export function updateDoctorProfile(payload) {
  return client.put('doctor/profile/update/', payload)
}

/** GET /doctor/patients/ */
export function getDoctorPatients() {
  return client.get('doctor/patients/')
}

/** GET /doctor/patient/:id/ */
export function getDoctorPatient(id) {
  return client.get(`doctor/patient/${id}/`)
}

/** POST /doctor/patient/:id/history/add/ */
export function addDoctorPatientHistory(id, payload) {
  return client.post(`doctor/patient/${id}/history/add/`, payload)
}

/** POST /doctor/patient/:id/report/upload/ */
export function uploadDoctorPatientReport(id, formData) {
  return client.post(`doctor/patient/${id}/report/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** DELETE /doctor/report/delete/:id/ */
export function deleteDoctorReport(reportId) {
  return client.delete(`doctor/report/delete/${reportId}/`)
}
