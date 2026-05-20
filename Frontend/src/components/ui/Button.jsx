import { forwardRef } from 'react'

const variants = {
  primary:
    'gradient-primary text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/45 hover:brightness-105 active:scale-[0.98]',
  secondary:
    'border border-violet-200/80 bg-white/70 text-violet-900 hover:bg-white/90 hover:border-violet-300 active:scale-[0.98]',
  ghost: 'text-violet-800 hover:bg-violet-100/60 active:scale-[0.98]',
  danger:
    'bg-rose-600 text-white shadow-md hover:bg-rose-700 active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export const Button = forwardRef(function Button(
  { className = '', variant = 'primary', size = 'md', disabled, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
})
