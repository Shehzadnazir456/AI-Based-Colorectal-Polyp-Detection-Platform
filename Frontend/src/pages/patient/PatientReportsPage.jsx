import { useEffect, useState } from 'react'
import { Download, FileImage } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import * as patientApi from '../../api/patient.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await patientApi.getPatientReports()
        if (!cancelled) setReports(normalizeList(data))
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

  const downloadUrl = (r) => r.file_url ?? r.url ?? r.download_url ?? r.image

  return (
    <div>
      <PageHeader title="Imaging reports" subtitle="AI-assisted reads from your care team with timestamps." />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {!loading && reports.length === 0 ? (
        <EmptyState title="No reports yet" description="When your clinician uploads imaging, it will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r, i) => {
            const id = r.id ?? r.pk ?? i
            const pred = r.prediction ?? r.label ?? r.result ?? r.ai_result
            const when = r.created_at ?? r.uploaded_at ?? r.date
            const url = downloadUrl(r)
            return (
              <GlassCard key={id} hover className="!p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <FileImage className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Report #{id}</p>
                      <p className="text-xs text-slate-500">{formatDate(when)}</p>
                      {pred != null ? (
                        <p className="mt-2 text-sm font-medium text-violet-800">Finding: {String(pred)}</p>
                      ) : null}
                    </div>
                  </div>
                  <Badge variant="success">AI</Badge>
                </div>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                ) : (
                  <p className="mt-4 text-xs text-slate-400">Download link not available from API.</p>
                )}
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
