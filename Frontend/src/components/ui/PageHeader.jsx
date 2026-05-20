import { motion } from 'framer-motion'

/** Title + optional subtitle + right slot for actions. */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </motion.div>
  )
}
