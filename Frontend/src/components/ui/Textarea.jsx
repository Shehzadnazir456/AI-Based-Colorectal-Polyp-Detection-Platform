import { forwardRef } from 'react'

export const Textarea = forwardRef(function Textarea(
  { label, error, id, className = '', rows = 4, ...rest },
  ref
) {
  const tid = id ?? rest.name
  return (
    <label className="block w-full space-y-1.5" htmlFor={tid}>
      {label ? (
        <span className="text-sm font-medium text-violet-950/85">{label}</span>
      ) : null}
      <textarea
        ref={ref}
        id={tid}
        rows={rows}
        className={`w-full resize-y rounded-xl border border-violet-200/80 bg-white/70 px-4 py-3 text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-300/60 ${error ? 'border-rose-400' : ''} ${className}`}
        {...rest}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  )
})
