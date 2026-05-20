const styles = {
  default: 'bg-violet-100/90 text-violet-900 border-violet-200/80',
  success: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/80',
  warning: 'bg-amber-100/90 text-amber-900 border-amber-200/80',
  danger: 'bg-rose-100/90 text-rose-900 border-rose-200/80',
  muted: 'bg-slate-100/90 text-slate-700 border-slate-200/80',
}

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
