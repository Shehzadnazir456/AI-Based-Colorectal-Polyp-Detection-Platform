import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, User } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import * as doctorApi from '../../api/doctor.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientsListPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await doctorApi.getDoctorPatients()
        if (!cancelled) setPatients(normalizeList(data))
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
        title="Patients"
        subtitle="Select a patient to review records, upload imaging, and view AI outputs."
      />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {!loading && patients.length === 0 ? (
        <EmptyState title="No patients yet" description="Patients linked to your account will appear here." />
      ) : (
        <div className="grid gap-4">
          {patients.map((p) => {
            const id = p.id ?? p.pk
            const name =
              [p.first_name, p.last_name].filter(Boolean).join(' ') ||
              p.full_name ||
              p.email ||
              `Patient #${id}`
            return (
              <Link key={id} to={`/doctor/patients/${id}`}>
                <GlassCard hover className="!p-4 transition hover:border-violet-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{p.email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.last_visit || p.updated_at ? (
                        <Badge variant="muted">{formatDate(p.last_visit || p.updated_at, { dateStyle: 'short' })}</Badge>
                      ) : null}
                      <ChevronRight className="h-5 w-5 text-violet-400" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
