import client from './client.js'

/** POST /feedback/submit/ */
export function submitFeedback(payload) {
  return client.post('feedback/submit/', payload)
}

/** GET /feedback/my/ */
export function getMyFeedback() {
  return client.get('feedback/my/')
}
