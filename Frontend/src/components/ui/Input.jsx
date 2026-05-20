import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { label, error, id, className = '', ...rest },
  ref
) {
  const inputId = id ?? rest.name
  return (
    <label className="block w-full space-y-1.5" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-violet-950/85">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-xl border border-violet-200/80 bg-white/70 px-4 py-2.5 text-slate-800 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-300/60 ${error ? 'border-rose-400 focus:ring-rose-200' : ''} ${className}`}
        {...rest}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  )
})
