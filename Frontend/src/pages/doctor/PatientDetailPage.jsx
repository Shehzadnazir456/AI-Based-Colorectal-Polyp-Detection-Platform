import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Upload, Stethoscope, Trash2, MessageCircle } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Textarea } from '../../components/ui/Textarea.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { ChatPanel } from '../../components/ui/ChatPanel.jsx'
import * as doctorApi from '../../api/doctor.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

export function PatientDetailPage() {
  const { patientId } = useParams()
  const [detail, setDetail] = useState(null)
  const [historyNote, setHistoryNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await doctorApi.getDoctorPatient(patientId)
      setDetail(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    void load()
  }, [load])

  const reports = normalizeList(detail?.reports ?? detail?.medical_reports)
  const history = normalizeList(detail?.history ?? detail?.medical_history)

  const addHistory = async (e) => {
    e.preventDefault()
    if (!historyNote.trim()) return
    setSaving(true)
    try {
      await doctorApi.addDoctorPatientHistory(patientId, { notes: historyNote, note: historyNote })
      setHistoryNote('')
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const deleteReport = async (rid) => {
    if (!window.confirm('Delete this report permanently?')) return
    try {
      await doctorApi.deleteDoctorReport(rid)
      await load()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const patientName =
    detail &&
    ([detail.first_name, detail.last_name].filter(Boolean).join(' ') ||
      detail.full_name ||
      detail.email ||
      `Patient #${patientId}`)

  return (
    <div>
      <PageHeader
        title={patientName || 'Patient'}
        subtitle="Medical history, imaging pipeline, and AI-assisted findings."
        actions={
          <Link to={`/doctor/patients/${patientId}/upload`}>
            <Button type="button">
              <Upload className="h-4 w-4" />
              Upload report
            </Button>
          </Link>
        }
      />

      {loading ? <Spinner /> : null}
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {detail && !loading ? (
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Patient info */}
          <GlassCard className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-sm text-slate-500">Patient</p>
                <p className="text-lg font-semibold text-slate-900">{patientName}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-800">{detail.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">DOB</dt>
                <dd className="font-medium text-slate-800">{detail.date_of_birth || detail.dob || '—'}</dd>
              </div>
            </dl>
          </GlassCard>

          {/* Add clinical note */}
          <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">Add clinical note</h3>
            <form onSubmit={addHistory} className="mt-4 space-y-3">
              <Textarea
                label="History entry"
                name="note"
                value={historyNote}
                onChange={(e) => setHistoryNote(e.target.value)}
                rows={3}
                placeholder="Symptoms, procedure notes, follow-up…"
              />
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Add to history'}
              </Button>
            </form>
          </GlassCard>

          {/* Reports */}
          <GlassCard className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-slate-900">Reports & AI output</h3>
            <div className="mt-4 space-y-3">
              {reports.length === 0 ? (
                <p className="text-sm text-slate-500">No reports uploaded yet.</p>
              ) : (
                reports.map((r) => {
                  const rid = r.id ?? r.pk

                  // Parse result object safely
                  const rawResult = r.result ?? r.ai_result
                  const parsed = rawResult
                    ? (typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult)
                    : null
                  const pred = parsed?.polyp_detected === true
                    ? 'Polyp Detected'
                    : parsed?.polyp_detected === false
                      ? 'No Polyp Found'
                      : null

                  return (
                    <div
                      key={rid}
                      className="flex flex-col gap-3 rounded-xl border border-violet-100/80 bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">Report #{rid}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(r.created_at || r.uploaded_at || r.date)}
                        </p>
                        {pred != null ? (
                          <p className={`mt-2 text-sm font-medium ${pred === 'Polyp Detected' ? 'text-red-600' : 'text-emerald-600'}`}>
                            AI: {pred}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/doctor/patients/${patientId}/result/${rid}`} state={{ result: parsed }}>
                          <Button variant="secondary" size="sm" type="button">
                            View AI result
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          type="button"
                          onClick={() => deleteReport(rid)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </GlassCard>

          {/* Medical history timeline */}
          <GlassCard className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-slate-900">Medical history timeline</h3>
            <ul className="mt-4 space-y-3">
              {history.length === 0 ? (
                <li className="text-sm text-slate-500">No entries yet.</li>
              ) : (
                history.map((h, i) => (
                  <li
                    key={h.id ?? i}
                    className="rounded-xl border border-slate-100 bg-white/60 px-3 py-2 text-sm text-slate-700"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted">{formatDate(h.created_at || h.date)}</Badge>
                    </div>
                    <p className="mt-1">{h.notes || h.note || h.description || JSON.stringify(h)}</p>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          {/* Chat with patient */}
          <GlassCard className="lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-violet-600" />
              <h3 className="text-lg font-semibold text-slate-900">Chat with patient</h3>
            </div>
            <ChatPanel
              currentRole="doctor"
              otherName={patientName || `Patient #${patientId}`}
              fetchMessages={() => doctorApi.getDoctorMessages(patientId)}
              postMessage={(msg) => doctorApi.sendDoctorMessage(patientId, { message: msg })}
            />
          </GlassCard>

        </div>
      ) : null}
    </div>
  )
}