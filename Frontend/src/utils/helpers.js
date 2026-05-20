/**
 * Format ISO date strings for display in the UI.
 */
export function formatDate(value, options) {
  if (!value) return '—'
  const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(d)
}

/**
 * Extract a human-readable message from axios / API errors.
 */
export function getErrorMessage(error) {
  if (error && typeof error === 'object' && 'response' in error) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') return data.detail
      if (typeof data.message === 'string') return data.message
      if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(' ')
      const firstKey = Object.keys(data)[0]
      const v = firstKey ? data[firstKey] : null
      if (Array.isArray(v)) return v.join(' ')
      if (typeof v === 'string') return v
    }
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

/** Normalize paginated or wrapped list responses from Django-style APIs. */
export function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (data?.results && Array.isArray(data.results)) return data.results
  if (data?.data && Array.isArray(data.data)) return data.data
  return []
}
