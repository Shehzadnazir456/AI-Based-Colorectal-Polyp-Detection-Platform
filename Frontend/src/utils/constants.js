/** API and app constants — base URL matches backend. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/'

export const STORAGE_KEYS = {
  TOKEN: 'polyp_token',
  USER: 'polyp_user',
}

export const ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
}
