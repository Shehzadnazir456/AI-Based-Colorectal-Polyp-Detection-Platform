import { Star } from 'lucide-react'

/**
 * Interactive star rating (1–5). Click selects; optional read-only mode.
 */
export function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(n)}
            className={`rounded-md p-0.5 transition ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            aria-pressed={active}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              className={`h-8 w-8 ${
                active
                  ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                  : 'text-slate-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
