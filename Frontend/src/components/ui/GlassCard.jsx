import { motion } from 'framer-motion'

/** Glassmorphism panel with optional motion entrance. */
export function GlassCard({ children, className = '', hover = false }) {
  const base =
    'glass rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_rgba(88,28,135,0.1)] backdrop-blur-xl'
  const hoverCls = hover ? ' transition-transform hover:-translate-y-0.5 hover:shadow-lg' : ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`${base}${hoverCls} ${className}`}
    >
      {children}
    </motion.div>
  )
}
