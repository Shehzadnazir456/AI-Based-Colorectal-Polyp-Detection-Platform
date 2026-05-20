import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Home', hash: '#home' },
  { label: 'About Us', hash: '#about' },
  { label: 'Contact Us', hash: '#contact' },
]

function scrollToHash(hash) {
  const id = hash.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleNav = (e, hash) => {
    if (!isHome) return
    e.preventDefault()
    setMenuOpen(false)
    scrollToHash(hash)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-violet-200/60 bg-white/75 shadow-sm shadow-violet-500/5 backdrop-blur-xl'
          : 'border-b border-transparent bg-white/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white shadow-lg shadow-violet-500/25 transition group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-violet-900 md:text-base">
              PolypCare AI
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-violet-600 sm:block">
              Polyp Detection
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(({ label, hash }) => (
            <Link
              key={label}
              to={isHome ? hash : `/${hash}`}
              onClick={(e) => handleNav(e, hash)}
              className="text-sm font-medium text-slate-700 transition hover:text-violet-700"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            className="rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition hover:brightness-110"
          >
            Login
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-violet-900 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-violet-100 bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map(({ label, hash }) => (
              <Link
                key={label}
                to={isHome ? hash : `/${hash}`}
                onClick={(e) => handleNav(e, hash)}
                className="text-sm font-medium text-slate-700"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/login"
              className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
