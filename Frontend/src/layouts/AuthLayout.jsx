import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { isDoctor, isPatient } from '../utils/authHelpers.js'

/** Centered auth pages on a soft gradient mesh background. */
export function AuthLayout() {
  const { isAuthenticated, user, initialized } = useAuth()
  if (initialized && isAuthenticated) {
    if (isDoctor(user)) return <Navigate to="/doctor/dashboard" replace />
    if (isPatient(user)) return <Navigate to="/patient/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(167,139,250,0.35),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.25),transparent_45%)]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mb-8 flex flex-col items-center text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/40">
          <Activity className="h-9 w-9 text-white" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          <span className="gradient-text">PolyGuard AI</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Colorectal polyp detection — secure clinical workspace powered by computer vision.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/50 bg-white/70 p-8 shadow-2xl shadow-violet-500/15 backdrop-blur-xl"
      >
        <Outlet />
      </motion.div>

      <p className="relative z-10 mt-10 max-w-lg text-center text-xs text-slate-500">
        For qualified healthcare professionals and enrolled patients. AI output is assistive only and does not replace
        clinical judgment.
      </p>
    </div>
  )
}
