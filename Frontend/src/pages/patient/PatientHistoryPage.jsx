import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { ChatPanel } from '../../components/ui/ChatPanel.jsx'
import * as patientApi from '../../api/patient.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientHistoryPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await patientApi.getPatientHistory()
        if (!cancelled) setEntries(normalizeList(data))
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader
        title="Medical history"
        subtitle="Structured timeline supplied by your authorized clinicians."
      />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {!loading && entries.length === 0 ? (
        <EmptyState
          title="No history entries"
          description="Your provider will add visit notes here."
        />
      ) : (
        <div className="relative space-y-4 before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-violet-200">
          {entries.map((h, i) => (
            <GlassCard key={h.id ?? i} className="relative !p-4 pl-12">
              <span className="absolute left-2 top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-violet-500 shadow" />
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">{formatDate(h.created_at || h.date)}</Badge>
                {h.provider ? <Badge>{h.provider}</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-slate-800">
                {h.notes || h.note || h.description || JSON.stringify(h)}
              </p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Chat with doctor ── */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-slate-900">Messages from your doctor</h3>
        </div>
        <ChatPanel
          currentRole="patient"
          otherName="Your Doctor"
          fetchMessages={patientApi.getPatientMessages}
          postMessage={(msg) => patientApi.sendPatientMessage({ message: msg })}
        />
      </div>
    </div>
  )
}