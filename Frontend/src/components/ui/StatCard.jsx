import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard.jsx'

/** SaaS-style metric tile with icon accent. */
export function StatCard({ title, value, hint, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlassCard hover className="relative overflow-hidden !p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-500/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600/90">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
          </div>
          {Icon ? (
            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 text-white shadow-lg shadow-violet-500/30">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
          ) : null}
        </div>
      </GlassCard>
    </motion.div>
  )
}
