import client from './client.js'

/** POST /chatbot/ask/ */
export function askChatbot(payload) {
  return client.post('chatbot/ask/', payload)
}

/** GET /chatbot/history/ */
export function getChatbotHistory() {
  return client.get('chatbot/history/')
}
