import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileScan, Bell, Activity } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { MiniAreaChart } from '../../components/dashboard/MiniAreaChart.jsx'
import * as doctorApi from '../../api/doctor.js'
import * as notificationsApi from '../../api/notifications.js'
import { normalizeList, getErrorMessage } from '../../utils/helpers.js'

export function DoctorDashboard() {
  const [patientCount, setPatientCount] = useState('—')
  const [notifCount, setNotifCount] = useState('—')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [pRes, nRes] = await Promise.all([doctorApi.getDoctorPatients(), notificationsApi.getNotifications()])
        if (!cancelled) {
          const patients = normalizeList(pRes.data)
          const notes = normalizeList(nRes.data)
          setPatientCount(String(patients.length))
          setNotifCount(String(notes.length))
        }
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
        title="Clinical overview"
        subtitle="Monitor patients, imaging uploads, and AI-assisted polyp findings in one place."
        actions={
          <Link
            to="/doctor/patients"
            className="rounded-xl border border-violet-200 bg-white/70 px-4 py-2 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-white"
          >
            View patients
          </Link>
        }
      />

      {loading ? (
        <Spinner label="Loading dashboard…" />
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : null}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Patients" value={patientCount} hint="Assigned cohort" icon={Users} delay={0} />
        <StatCard title="Notifications" value={notifCount} hint="System & alerts" icon={Bell} delay={0.05} />
        <StatCard title="AI modules" value="CV + NLP" hint="Detection & chat" icon={FileScan} delay={0.1} />
        <StatCard title="Status" value="Online" hint="API connected" icon={Activity} delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Case activity</h3>
          <p className="mt-1 text-sm text-slate-600">Rolling utilization — illustrative trend.</p>
          <div className="mt-4 overflow-hidden rounded-xl bg-violet-50/50 p-2">
            <MiniAreaChart />
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Workflows</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="flex justify-between rounded-xl border border-violet-100/80 bg-white/50 px-3 py-2">
              <span>Upload endoscopy stills</span>
              <Link className="font-medium text-violet-700 hover:underline" to="/doctor/patients">
                Open
              </Link>
            </li>
            <li className="flex justify-between rounded-xl border border-violet-100/80 bg-white/50 px-3 py-2">
              <span>Review AI predictions</span>
              <span className="text-slate-400">Per-report</span>
            </li>
            <li className="flex justify-between rounded-xl border border-violet-100/80 bg-white/50 px-3 py-2">
              <span>Notifications</span>
              <Link className="font-medium text-violet-700 hover:underline" to="/doctor/notifications">
                Open
              </Link>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
