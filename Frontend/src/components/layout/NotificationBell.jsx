import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Loader2, Trash2 } from 'lucide-react'
import * as notificationsApi from '../../api/notifications.js'
import { formatDate, getErrorMessage } from '../../utils/helpers.js'

/**
 * Header notification bell with dropdown: list, mark read, delete.
 * Normalizes API list shapes: array or { results: [] }.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef(null)

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data
    if (data?.results && Array.isArray(data.results)) return data.results
    if (data?.data && Array.isArray(data.data)) return data.data
    return []
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await notificationsApi.getNotifications()
      setItems(normalizeList(data))
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const unread = items.filter((n) => !n.read && !n.is_read).length

  const onRead = async (id) => {
    try {
      await notificationsApi.markNotificationRead(id)
      setItems((prev) =>
        prev.map((n) =>
          (n.id === id || n.pk === id) ? { ...n, read: true, is_read: true } : n
        )
      )
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const onDelete = async (id) => {
    try {
      await notificationsApi.deleteNotification(id)
      setItems((prev) => prev.filter((n) => n.id !== id && n.pk !== id))
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => {
            const next = !o
            if (next) void load()
            return next
          })
        }}
        className="relative rounded-xl border border-white/40 bg-white/50 p-2.5 text-violet-900 shadow-inner backdrop-blur-md transition hover:bg-white/70"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-2xl shadow-violet-500/20 backdrop-blur-xl"
          >
            <div className="border-b border-violet-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">Alerts and system messages</p>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
              ) : error ? (
                <p className="p-4 text-sm text-rose-600">{error}</p>
              ) : items.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
              ) : (
                items.map((n) => {
                  const id = n.id ?? n.pk
                  const read = n.read || n.is_read
                  const title = n.title || n.subject || 'Notification'
                  const body = n.message || n.body || n.detail || ''
                  const created = n.created_at || n.created || n.timestamp
                  return (
                    <div
                      key={id}
                      className={`border-b border-violet-50 px-3 py-3 last:border-0 ${read ? 'opacity-75' : 'bg-violet-50/50'}`}
                    >
                      <p className="text-sm font-medium text-slate-900">{title}</p>
                      {body ? <p className="mt-1 text-xs text-slate-600 line-clamp-3">{body}</p> : null}
                      <p className="mt-1 text-[10px] text-slate-400">{formatDate(created)}</p>
                      <div className="mt-2 flex gap-2">
                        {!read ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg bg-violet-600/10 px-2 py-1 text-xs font-medium text-violet-800 hover:bg-violet-600/20"
                            onClick={() => onRead(id)}
                          >
                            <Check className="h-3 w-3" /> Mark read
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                          onClick={() => onDelete(id)}
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
