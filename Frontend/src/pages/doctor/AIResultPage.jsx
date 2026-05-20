import { Link, useLocation, useParams } from 'react-router-dom'
import { Brain, Gauge, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { GlassCard } from '../../components/ui/GlassCard.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

/**
 * Displays structured AI prediction with confidence — consumes navigation state from upload flow.
 */
export function AIResultPage() {
  const { patientId, reportId } = useParams()
  const { state } = useLocation()
  const r = state?.result ?? {}
  const prediction =
    r.prediction ??
    r.label ??
    r.result ??
    r.class_label ??
    r.polyp_detected ??
    r.diagnosis ??
    (r.polyp === true ? 'Polyp suspected' : r.polyp === false ? 'No polyp' : null)
  const cRaw = r.confidence ?? r.score ?? r.probability ?? r.confidence_score
  const confidence =
    cRaw == null
      ? null
      : typeof cRaw === 'number'
        ? cRaw <= 1
          ? `${(cRaw * 100).toFixed(1)}%`
          : `${cRaw.toFixed(1)}%`
        : String(cRaw)
  const explanation = r.explanation ?? r.notes ?? r.detail ?? ''

  return (
    <div>
      <PageHeader
        title="AI analysis result"
        subtitle="Assistive output — correlate with histopathology and clinical context."
        actions={
          <Link to={`/doctor/patients/${patientId}`}>
            <Button variant="secondary" type="button">
              Back to patient
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="relative overflow-hidden border-violet-200/80 !bg-gradient-to-br !from-white/90 !to-violet-50/90">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-xl shadow-violet-500/30">
                <Brain className="h-10 w-10" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Model output</p>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  {prediction != null ? String(prediction) : 'Result pending'}
                </h2>
                {reportId ? (
                  <p className="mt-2 text-sm text-slate-500">Report reference: {reportId}</p>
                ) : null}
              </div>
            </div>

            <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/60 bg-white/70 p-4 shadow-inner">
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium">Confidence</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-violet-800">{confidence ?? '—'}</p>
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

        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-900">Clinical context</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="warning">Assistive</Badge>
            <Badge variant="success">Encrypted transport</Badge>
            <Badge>Patient #{patientId}</Badge>
          </div>
          {explanation ? (
            <p className="mt-6 text-sm leading-relaxed text-slate-700">{String(explanation)}</p>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              No additional narrative returned. Attach chart notes in the patient record as needed.
            </p>
          )}
          <div className="mt-8 rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-xs text-violet-900">
            Tip: export this summary to your EMR workflow or share through the patient messaging module when approved by
            policy.
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
