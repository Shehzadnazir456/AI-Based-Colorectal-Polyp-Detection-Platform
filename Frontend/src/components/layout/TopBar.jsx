import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { NotificationBell } from './NotificationBell.jsx'
import { Button } from '../ui/Button.jsx'

/**
 * Sticky top bar: mobile menu trigger, branding, notifications, sign out.
 */
export function TopBar({ onMenuClick, portalLabel }) {
  const { user, logout } = useAuth()
  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'Account'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/40 bg-white/45 px-4 py-3 shadow-sm backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-violet-200/60 bg-white/70 p-2 text-violet-900 shadow-sm lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600/90">PolyGuard AI</p>
          <p className="text-sm font-semibold text-slate-800">{portalLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role || 'user'}</p>
        </div>
        <NotificationBell />
        <Button variant="secondary" size="sm" className="!px-3" onClick={() => logout()} title="Sign out">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  )
}
