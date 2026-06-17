import { useEffect, useRef, useState } from 'react'
import { FileImage, CheckCircle, XCircle, Clock } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Spinner } from '../../components/ui/Spinner.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import * as patientApi from '../../api/patient.js'
import { normalizeList, formatDate, getErrorMessage } from '../../utils/helpers.js'

// ── Risk level helper ──────────────────────────────────────────────────────
function getRisk(result) {
  if (!result || result.polyp_detected === false) return { label: 'Clear', variant: 'success', color: 'text-emerald-600' }
  const area = result.polyp_area_pct ?? 0
  if (area < 5)  return { label: 'Moderate Risk', variant: 'warning', color: 'text-amber-600' }
  return           { label: 'High Risk',     variant: 'danger',  color: 'text-red-600'   }
}

// ── PDF generator (patient-friendly version) ──────────────────────────────
function downloadPatientPDF(r) {
  const result     = r.result ?? {}
  const risk       = getRisk(result)
  const doc        = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW      = doc.internal.pageSize.getWidth()
  const now        = new Date().toLocaleString()
  const reportDate = formatDate(r.created_at ?? r.uploaded_at ?? r.date)

  // Header
  doc.setFillColor(109, 40, 217)
  doc.rect(0, 0, pageW, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('PolyGuard AI', 14, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Patient Imaging Report', 14, 20)
  doc.text(`Downloaded: ${now}`, pageW - 14, 20, { align: 'right' })

  // Report info
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Report Information', 14, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Report ID   : #${r.id ?? r.pk ?? '—'}`, 14, 48)
  doc.text(`Scan Date   : ${reportDate}`,             14, 54)
  doc.text(`Analyzed by : PolyGuard AI (EfficientUNet)`, 14, 60)

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(14, 66, pageW - 14, 66)

  // Result
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('AI Screening Result', 14, 76)

  const detected = result.polyp_detected
  doc.setFillColor(detected ? 254 : 240, detected ? 226 : 253, detected ? 226 : 244)
  doc.roundedRect(14, 80, 85, 20, 3, 3, 'F')
  doc.setTextColor(detected ? 185 : 22, detected ? 28 : 163, detected ? 26 : 74)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(detected ? 'Polyp Detected' : 'No Polyp Found', 56, 93, { align: 'center' })

  // Area
  if (result.polyp_area_pct != null) {
    doc.setFillColor(245, 243, 255)
    doc.roundedRect(105, 80, 85, 20, 3, 3, 'F')
    doc.setTextColor(109, 40, 217)
    doc.setFontSize(10)
    doc.text('Affected Area', 147, 88, { align: 'center' })
    doc.setFontSize(13)
    doc.text(`${result.polyp_area_pct}%`, 147, 96, { align: 'center' })
  }

  // Risk
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Risk Level: ${risk.label}`, 14, 114)

  // Patient note
  doc.setFillColor(255, 251, 235)
  doc.roundedRect(14, 120, pageW - 28, 22, 3, 3, 'F')
  doc.setTextColor(120, 80, 0)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(
    'This report is for informational purposes only. Please consult your doctor before making\nany health decisions based on this result.',
    20, 129, { maxWidth: pageW - 40 }
  )

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.line(14, 148, pageW - 14, 148)

  // Images
  let yPos = 156
  if (result.overlay_png_b64) {
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Scan Overlay (highlighted region)', 14, yPos)
    yPos += 4
    doc.addImage(`data:image/png;base64,${result.overlay_png_b64}`, 'PNG', 14, yPos, 85, 85)
  }
  if (result.mask_png_b64) {
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Segmentation Mask', pageW / 2 + 4, yPos - 4)
    doc.addImage(`data:image/png;base64,${result.mask_png_b64}`, 'PNG', pageW / 2 + 4, yPos, 85, 85)
  }

  yPos += 92

  // Footer
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

  doc.save(`PolyGuard_MyReport_${r.id ?? r.pk}.pdf`)
}

// ── Component ──────────────────────────────────────────────────────────────
export function PatientReportsPage() {
  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [error, setError]       = useState('')
  const scrollRef = useRef(null)  // ✅ track scroll position

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
    return () => { cancelled = true }
  }, [])

  // ✅ Restore scroll position when expanded panel opens/closes
  const toggleExpanded = (id) => {
    scrollRef.current = window.scrollY
    setExpanded(prev => prev === id ? null : id)
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollRef.current, behavior: 'instant' })
    })
  }

  return (
    <div>
      <PageHeader
        title="Imaging reports"
        subtitle="AI-assisted reads from your care team with timestamps."
      />

      {loading && <Spinner />}
      {error   && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      {!loading && reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="When your clinician uploads imaging, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((r, i) => {
            const id     = r.id ?? r.pk ?? i
            const result = r.result ?? {}
            const risk   = getRisk(result)
            const when   = r.created_at ?? r.uploaded_at ?? r.date
            const isOpen = expanded === id

            return (
              <GlassCard key={id} className="!p-0 overflow-hidden">

                {/* ── Summary row ── */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <FileImage className="h-6 w-6" />
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-slate-900">Report #{id}</p>
                      <p className="text-xs text-slate-500">{formatDate(when)}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="success">AI Analyzed</Badge>
                        {result.polyp_detected != null ? (
                          <Badge variant={risk.variant}>{risk.label}</Badge>
                        ) : (
                          <Badge variant="muted">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      onClick={() => toggleExpanded(id)}  // ✅ use toggleExpanded
                    >
                      {isOpen ? 'Hide details' : 'View details'}
                    </Button>
                    {result.overlay_png_b64 && (
                      <Button
                        variant="primary"
                        size="sm"
                        type="button"
                        onClick={() => downloadPatientPDF(r)}
                      >
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>

                {/* ── Expanded detail panel ── */}
                {isOpen && (
                  <div className="border-t border-violet-100 bg-violet-50/40 p-5">

                    {/* Result summary */}
                    <div className="grid gap-4 sm:grid-cols-3 mb-6">
                      <div className="rounded-xl bg-white/80 border border-violet-100 p-4 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Finding</p>
                        {result.polyp_detected === true  && <CheckCircle className="mx-auto h-8 w-8 text-red-500 mb-1" />}
                        {result.polyp_detected === false && <XCircle     className="mx-auto h-8 w-8 text-emerald-500 mb-1" />}
                        {result.polyp_detected == null   && <Clock       className="mx-auto h-8 w-8 text-slate-400 mb-1" />}
                        <p className={`text-sm font-bold ${risk.color}`}>
                          {result.polyp_detected === true  ? 'Polyp Detected'  :
                           result.polyp_detected === false ? 'No Polyp Found'  : 'Pending'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/80 border border-violet-100 p-4 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Affected Area</p>
                        <p className="text-3xl font-bold text-violet-700">
                          {result.polyp_area_pct != null ? `${result.polyp_area_pct}%` : '—'}
                        </p>
                        {result.polyp_area_pct != null && (
                          <div className="mt-2 h-1.5 w-full rounded-full bg-violet-100">
                            <div
                              className="h-1.5 rounded-full bg-violet-500"
                              style={{ width: `${Math.min(result.polyp_area_pct, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl bg-white/80 border border-violet-100 p-4 text-center shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Risk Level</p>
                        <p className={`text-xl font-bold mt-4 ${risk.color}`}>{risk.label}</p>
                      </div>
                    </div>

                    {/* Images */}
                    {(result.overlay_png_b64 || result.mask_png_b64) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {result.overlay_png_b64 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Scan overlay
                            </p>
                            <img
                              src={`data:image/png;base64,${result.overlay_png_b64}`}
                              alt="Overlay"
                              className="w-full rounded-xl border border-violet-100 shadow-md"
                            />
                          </div>
                        )}
                        {result.mask_png_b64 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Segmentation mask
                            </p>
                            <img
                              src={`data:image/png;base64,${result.mask_png_b64}`}
                              alt="Mask"
                              className="w-full rounded-xl border border-violet-100 shadow-md"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-xs text-amber-800">
                      This result is AI-assisted and for informational purposes only. Please consult your doctor before making any health decisions.
                    </div>
                  </div>
                )}

              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}