import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isDoctor, isPatient } from '../utils/authHelpers.js'
import { Spinner } from '../components/ui/Spinner.jsx'
import { ROLES } from '../utils/constants.js'

/**
 * Wraps routes that require authentication and optionally a specific role.
 * @param {{ children: import('react').ReactNode, role?: 'doctor' | 'patient' }} props
 */
export function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, initialized } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading session…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role === ROLES.DOCTOR && !isDoctor(user)) {
    return <Navigate to="/patient/dashboard" replace />
  }

  if (role === ROLES.PATIENT && !isPatient(user)) {
    return <Navigate to="/doctor/dashboard" replace />
  }

  return children
}
