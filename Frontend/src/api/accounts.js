import client from './client.js'

/** POST /accounts/register/ */
export function register(payload) {
  return client.post('accounts/register/', payload)
}

/** POST /accounts/login/ */
export function login(payload) {
  return client.post('accounts/login/', payload)
}
