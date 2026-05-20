import { Link, useLocation } from 'react-router-dom'
import { Activity, Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT } from '../../utils/homeContent'

const footerLinks = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Analytics', hash: '#analytics' },
  { label: 'Contact', hash: '#contact' },
]

const productLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
]

function scrollToHash(hash) {
  const id = hash.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const handleNav = (e, hash) => {
    if (!isHome) return
    e.preventDefault()
    scrollToHash(hash)
  }

  return (
    <footer className="footer-pro mt-4 border-t border-violet-900/20">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6a11cb] to-[#2575fc] text-white shadow-lg">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-bold text-white">PolypCare AI</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-violet-300">
                  Polyp Detection System
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-violet-200/90">
              AI-powered colorectal polyp detection for accurate, timely screening and
              clinical decision support.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map(({ label, hash }) => (
                <li key={label}>
                  <Link
                    to={isHome ? hash : `/${hash}`}
                    onClick={(e) => handleNav(e, hash)}
                    className="text-sm text-violet-100/90 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {productLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-violet-100/90 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Contact
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-violet-100/90">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-white transition">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all hover:text-white transition"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <span className="leading-snug">{CONTACT.address}</span>
              </li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Project
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-violet-100/80">
              Final-year healthcare AI system — IIUI Islamabad. For educational and
              decision-support use under clinical supervision.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-violet-300/90 md:text-left">
            &copy; {new Date().getFullYear()} PolypCare AI · International Islamic University
            Islamabad. All rights reserved.
          </p>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-violet-400/90 md:text-left">
            <strong className="font-semibold text-violet-300">Medical disclaimer:</strong>{' '}
            This platform supports education and screening awareness only. It does not
            replace professional diagnosis, treatment, or emergency care. Always consult a
            qualified healthcare provider.
          </p>
        </div>
      </div>
    </footer>
  )
}
