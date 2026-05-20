import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, X } from 'lucide-react'

/**
 * Responsive app sidebar with glass styling and active route highlight.
 * @param {{ items: Array<{ to: string, label: string, icon: import('lucide-react').LucideIcon }>, open: boolean, onClose: () => void, roleLabel: string }} props
 */
export function Sidebar({ items, open, onClose, roleLabel }) {
  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-white/30 bg-gradient-to-b from-violet-950/95 via-violet-900/90 to-indigo-950/95 px-4 py-6 text-violet-50 shadow-2xl shadow-violet-900/30 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-500/40">
              <Activity className="h-6 w-6 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/90">PolyGuard</p>
              <p className="text-sm font-bold text-white">{roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-violet-200 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-inner shadow-violet-500/20'
                    : 'text-violet-200/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-violet-200/80">
          Clinical decision support — verify all AI outputs against standard-of-care protocols.
        </div>
      </aside>
    </>
  )
}
