import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, History, Bell } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { MiniAreaChart } from '../../components/dashboard/MiniAreaChart.jsx'
import * as patientApi from '../../api/patient.js'
import * as notificationsApi from '../../api/notifications.js'
import { normalizeList, getErrorMessage } from '../../utils/helpers.js'

export function PatientDashboard() {
  const [reportCount, setReportCount] = useState('—')
  const [historyCount, setHistoryCount] = useState('—')
  const [notifCount, setNotifCount] = useState('—')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [rep, hist, notes] = await Promise.all([
          patientApi.getPatientReports(),
          patientApi.getPatientHistory(),
          notificationsApi.getNotifications(),
        ])
        if (!cancelled) {
          setReportCount(String(normalizeList(rep.data).length))
          setHistoryCount(String(normalizeList(hist.data).length))
          setNotifCount(String(normalizeList(notes.data).length))
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
        title="Your health snapshot"
        subtitle="View imaging results, history, and messages from your care team."
        actions={
          <Link
            to="/patient/reports"
            className="rounded-xl border border-violet-200 bg-white/70 px-4 py-2 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-white"
          >
            My reports
          </Link>
        }
      />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="AI reports" value={reportCount} hint="Imaging uploads" icon={FileStack} delay={0} />
        <StatCard title="History entries" value={historyCount} hint="Timeline items" icon={History} delay={0.05} />
        <StatCard title="Notifications" value={notifCount} hint="Unread + all" icon={Bell} delay={0.1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Engagement</h3>
          <p className="mt-1 text-sm text-slate-600">Illustrative activity trend.</p>
          <div className="mt-4 rounded-xl bg-violet-50/50 p-2">
            <MiniAreaChart points={[22, 38, 30, 52, 44, 60, 48, 70]} />
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Quick links</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link className="font-medium text-violet-700 hover:underline" to="/patient/history">
                Medical history
              </Link>
            </li>
            <li>
              <Link className="font-medium text-violet-700 hover:underline" to="/patient/chatbot">
                Ask the health assistant
              </Link>
            </li>
            <li>
              <Link className="font-medium text-violet-700 hover:underline" to="/patient/feedback">
                Send feedback
              </Link>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
