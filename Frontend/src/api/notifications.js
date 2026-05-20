import client from './client.js'

/** GET /notifications/ */
export function getNotifications() {
  return client.get('notifications/')
}

/** PUT /notifications/read/:id/ */
export function markNotificationRead(id) {
  return client.put(`notifications/read/${id}/`)
}

/** DELETE /notifications/delete/:id/ */
export function deleteNotification(id) {
  return client.delete(`notifications/delete/${id}/`)
}
