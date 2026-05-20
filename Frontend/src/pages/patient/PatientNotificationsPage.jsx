import { useEffect, useState } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Button } from '../../components/ui/Button.jsx'
import * as notificationsApi from '../../api/notifications.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientNotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
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
  }

  useEffect(() => {
    load()
  }, [])

  const onRead = async (id) => {
    try {
      await notificationsApi.markNotificationRead(id)
      setItems((prev) =>
        prev.map((n) => (n.id === id || n.pk === id ? { ...n, read: true, is_read: true } : n))
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
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Messages from your care team, reminders, and system updates."
      />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {!loading && items.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const id = n.id ?? n.pk
            const read = n.read || n.is_read
            return (
              <GlassCard key={id} className={`!p-4 ${read ? 'opacity-80' : 'ring-2 ring-violet-200/80'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{n.title || n.subject || 'Notification'}</p>
                      <p className="mt-1 text-sm text-slate-600">{n.message || n.body || n.detail || ''}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(n.created_at || n.created || n.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!read ? (
                      <Button size="sm" variant="secondary" type="button" onClick={() => onRead(id)}>
                        <Check className="h-4 w-4" />
                        Read
                      </Button>
                    ) : null}
                    <Button size="sm" variant="danger" type="button" onClick={() => onDelete(id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
