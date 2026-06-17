import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Brain, Gauge, ShieldCheck, Activity, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import * as doctorApi from '../../api/doctor.js'

export function AIResultPage() {
  const { patientId, reportId } = useParams()
  const { state } = useLocation()
  const [result, setResult] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (state?.result && state.result.polyp_detected !== undefined) {
      const r = typeof state.result === 'string'
        ? JSON.parse(state.result)
        : state.result
      setResult(r)
      doctorApi.getDoctorPatient(patientId)
        .then(({ data }) => setPatient(data))
        .catch(console.error)
    } else {
      setLoading(true)
      doctorApi.getDoctorPatient(patientId)
        .then(({ data }) => {
          setPatient(data)
          const reports = data.reports ?? []
          const found = reports.find(r => String(r.id ?? r.pk) === String(reportId))
          if (found?.result) {
            const r = typeof found.result === 'string'
              ? JSON.parse(found.result)
              : found.result
            setResult(r)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [state, patientId, reportId])

  const r = result ?? {}
  const polypDetected = r.polyp_detected ?? null
  const areaPercent   = r.polyp_area_pct  ?? null
  const maskB64       = r.mask_png_b64    ?? null
  const overlayB64    = r.overlay_png_b64 ?? null

  const predictionLabel = polypDetected === true
    ? 'Polyp Detected'
    : polypDetected === false
      ? 'No Polyp Found'
      : 'Result Pending'

  const predictionColor = polypDetected === true
    ? 'text-red-600'
    : polypDetected === false
      ? 'text-emerald-600'
      : 'text-slate-400'

  const confidenceLabel = areaPercent != null ? `${areaPercent}% area` : '—'

  if (loading) return <Spinner />

  // ── PDF Generation ────────────────────────────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const now   = new Date().toLocaleString()

    // ── Header banner ──
    doc.setFillColor(109, 40, 217)
    doc.rect(0, 0, pageW, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('PolyGuard AI', 14, 12)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Colorectal Polyp Screening Report', 14, 20)
    doc.text(`Generated: ${now}`, pageW - 14, 20, { align: 'right' })

    // ── Report Details heading ──
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Report Details', 14, 40)

    // ── Patient info — 2-column layout ──
    const firstName = patient?.first_name ?? ''
    const lastName  = patient?.last_name  ?? ''
    const fullName  = [firstName, lastName].filter(Boolean).join(' ') || '—'
    const age       = patient?.age    ?? '—'
    const gender    = patient?.gender || '—'
    const phone     = patient?.phone  || '—'
    const email     = patient?.email  || '—'

    const col1 = 14
    const col2 = pageW / 2
    const valOffset1 = 36
    const valOffset2 = 28

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)

    // Labels — left
    doc.text('Patient ID',   col1, 50)
    doc.text('Patient Name', col1, 57)
    doc.text('Age',          col1, 64)
    doc.text('Gender',       col1, 71)

    // Labels — right
    doc.text('Phone',        col2, 50)
    doc.text('Email',        col2, 57)
    doc.text('Report Ref',   col2, 64)
    doc.text('Date',         col2, 71)

    // Values — left
    doc.setTextColor(30, 30, 30)
    doc.setFont('helvetica', 'bold')
    doc.text(`: ${patientId ?? '—'}`, col1 + valOffset1, 50)
    doc.text(`: ${fullName}`,          col1 + valOffset1, 57)
    doc.text(`: ${age}`,               col1 + valOffset1, 64)
    doc.text(`: ${gender}`,            col1 + valOffset1, 71)

    // Values — right
    doc.text(`: ${phone}`,             col2 + valOffset2, 50)
    doc.text(`: ${email}`,             col2 + valOffset2, 57)
    doc.text(`: ${reportId ?? '—'}`,   col2 + valOffset2, 64)
    doc.text(`: ${now}`,               col2 + valOffset2, 71)

    doc.setFont('helvetica', 'normal')
    doc.setDrawColor(200, 200, 200)
    doc.line(14, 77, pageW - 14, 77)

    // ── AI Analysis Result ──
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('AI Analysis Result', 14, 87)

    const isDetected = polypDetected === true
    doc.setFillColor(isDetected ? 254 : 240, isDetected ? 226 : 253, isDetected ? 226 : 244)
    doc.roundedRect(14, 91, 80, 18, 3, 3, 'F')
    doc.setTextColor(isDetected ? 185 : 22, isDetected ? 28 : 163, isDetected ? 26 : 74)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(predictionLabel, 54, 103, { align: 'center' })

    doc.setFillColor(245, 243, 255)
    doc.roundedRect(100, 91, 80, 18, 3, 3, 'F')
    doc.setTextColor(109, 40, 217)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Affected Area', 140, 99, { align: 'center' })
    doc.setFontSize(12)
    doc.text(confidenceLabel, 140, 106, { align: 'center' })

    doc.setTextColor(80, 80, 80)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'This read is probabilistic. Mandatory pathology confirmation is required for treatment decisions.',
      14, 117, { maxWidth: pageW - 28 }
    )

    doc.setDrawColor(200, 200, 200)
    doc.line(14, 124, pageW - 14, 124)

    // ── Images ──
    let yPos = 132
    if (overlayB64) {
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Overlay — Detected Region (Red)', 14, yPos)
      yPos += 4
      doc.addImage(`data:image/png;base64,${overlayB64}`, 'PNG', 14, yPos, 85, 85)
    }
    if (maskB64) {
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Segmentation Mask', pageW / 2 + 4, yPos - 4)
      doc.addImage(`data:image/png;base64,${maskB64}`, 'PNG', pageW / 2 + 4, yPos, 85, 85)
    }

    // ── Footer ──
    yPos += 92
    doc.setDrawColor(200, 200, 200)
    doc.line(14, yPos, pageW - 14, yPos)
    yPos += 6
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      'PolyGuard AI — For clinical decision support only. Not a substitute for professional medical diagnosis.',
      pageW / 2, yPos, { align: 'center' }
    )

    doc.save(`PolyGuard_Report_Patient${patientId}_Ref${reportId}.pdf`)
  }

  return (
    <div>
      <PageHeader
        title="AI analysis result"
        subtitle="Assistive output — correlate with histopathology and clinical context."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="primary" type="button" onClick={downloadPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Link to={`/doctor/patients/${patientId}`}>
              <Button variant="secondary" type="button">Back to patient</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Model output card ── */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="relative overflow-hidden border-violet-200/80 !bg-gradient-to-br !from-white/90 !to-violet-50/90">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-xl shadow-violet-500/30">
                <Brain className="h-10 w-10" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Model output</p>
                <h2 className={`mt-1 text-3xl font-bold ${predictionColor}`}>{predictionLabel}</h2>
                {reportId && <p className="mt-2 text-sm text-slate-500">Report reference: {reportId}</p>}
              </div>
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 shadow-inner">
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium">Affected Area</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-violet-800">{confidenceLabel}</p>
                {areaPercent != null && (
                  <div className="mt-2 h-2 w-full rounded-full bg-violet-100">
                    <div
                      className="h-2 rounded-full bg-violet-500 transition-all"
                      style={{ width: `${Math.min(areaPercent, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 shadow-inner">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">Governance</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  This read is probabilistic. Mandatory pathology confirmation for treatment decisions.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Clinical context card ── */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Clinical context</h3>

          {/* Status badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="warning">Assistive AI</Badge>
            <Badge variant="success">Encrypted transport</Badge>
            <Badge>Patient #{patientId}</Badge>
            {polypDetected === true  && <Badge variant="danger">Polyp Flagged</Badge>}
            {polypDetected === false && <Badge variant="success">Clear</Badge>}
          </div>

          {/* Patient snapshot */}
          {patient && (
            <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/40 p-4 space-y-2 text-sm">
              <p className="font-semibold text-slate-700 mb-1">Patient snapshot</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                <span className="text-slate-400">Name</span>
                <span className="font-medium text-slate-800">
                  {[patient.first_name, patient.last_name].filter(Boolean).join(' ') || '—'}
                </span>
                <span className="text-slate-400">Age</span>
                <span className="font-medium text-slate-800">{patient.age ?? '—'}</span>
                <span className="text-slate-400">Gender</span>
                <span className="font-medium text-slate-800">{patient.gender || '—'}</span>
                <span className="text-slate-400">Phone</span>
                <span className="font-medium text-slate-800">{patient.phone || '—'}</span>
              </div>
            </div>
          )}

          {/* Finding summary */}
          <div className={`mt-4 rounded-xl border p-4 text-sm ${
            polypDetected === true
              ? 'border-red-100 bg-red-50/50 text-red-800'
              : polypDetected === false
                ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800'
                : 'border-slate-100 bg-slate-50/50 text-slate-600'
          }`}>
            {polypDetected === true && (
              <>
                <p className="font-semibold">⚠ Polyp detected — follow-up required</p>
                <p className="mt-1 text-xs">
                  AI flagged a suspicious region covering {confidenceLabel} of the frame.
                  Histopathology confirmation and clinical correlation are mandatory before any treatment decision.
                </p>
              </>
            )}
            {polypDetected === false && (
              <>
                <p className="font-semibold">✓ No polyp detected in this frame</p>
                <p className="mt-1 text-xs">
                  The model found no suspicious regions. This is a probabilistic result —
                  routine follow-up per clinical protocol is still advised.
                </p>
              </>
            )}
            {polypDetected === null && (
              <p>Result is pending or could not be determined. Please re-run analysis or consult manually.</p>
            )}
          </div>

          {/* Governance note */}
          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-xs text-violet-700">
            This output is for clinical decision <strong>support only</strong>. It does not replace pathology,
            endoscopy review, or physician judgment. Report ref: <strong>#{reportId}</strong>
          </div>
        </GlassCard>

        {/* ── Segmentation output ── */}
        {(overlayB64 || maskB64) && (
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-violet-600" />
                <h3 className="text-lg font-semibold text-slate-900">Segmentation output</h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {overlayB64 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Overlay (red = detected region)
                    </p>
                    <img
                      src={`data:image/png;base64,${overlayB64}`}
                      alt="Polyp overlay"
                      className="w-full rounded-xl border border-violet-100 shadow-md"
                    />
                  </div>
                )}
                {maskB64 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Segmentation mask
                    </p>
                    <img
                      src={`data:image/png;base64,${maskB64}`}
                      alt="Segmentation mask"
                      className="w-full rounded-xl border border-violet-100 shadow-md"
                    />
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

      </div>
    </div>
  )
}