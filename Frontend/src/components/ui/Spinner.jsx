import { Loader2 } from 'lucide-react'

/** Centered loading indicator for pages and async sections. */
export function Spinner({ className = '', label = 'Loading' }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} role="status" aria-live="polite">
      <Loader2 className="h-10 w-10 animate-spin text-violet-600 drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
      {label ? <p className="text-sm font-medium text-violet-900/80">{label}</p> : null}
    </div>
  )
}
