import { motion } from 'framer-motion'

/** Lightweight decorative chart strip for dashboard hero cards (no external chart lib). */
export function MiniAreaChart({ points = [40, 65, 45, 78, 55, 90, 70, 88] }) {
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const w = 280
  const h = 64
  const step = w / (points.length - 1 || 1)
  const pathD = points
    .map((p, i) => {
      const x = i * step
      const y = h - ((p - min) / range) * (h - 8) - 4
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  const fillD = `${pathD} L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full text-violet-500/30" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        d={fillD}
        fill="url(#areaGrad)"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        d={pathD}
        fill="none"
        stroke="rgb(124, 58, 237)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
