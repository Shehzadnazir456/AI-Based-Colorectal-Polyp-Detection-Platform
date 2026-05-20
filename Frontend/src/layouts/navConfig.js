import {
  LayoutDashboard,
  Users,
  Bell,
  MessageCircle,
  Star,
  UserCircle,
  FileStack,
  History,
} from 'lucide-react'

/** Sidebar links for clinician workspace. */
export const doctorNav = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/notifications', label: 'Notifications', icon: Bell },
  { to: '/doctor/chatbot', label: 'AI Assistant', icon: MessageCircle },
  { to: '/doctor/feedback', label: 'Feedback', icon: Star },
  { to: '/doctor/profile', label: 'Profile', icon: UserCircle },
]

/** Sidebar links for patient portal. */
export const patientNav = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/reports', label: 'Reports', icon: FileStack },
  { to: '/patient/history', label: 'Medical history', icon: History },
  { to: '/patient/notifications', label: 'Notifications', icon: Bell },
  { to: '/patient/chatbot', label: 'AI Assistant', icon: MessageCircle },
  { to: '/patient/feedback', label: 'Feedback', icon: Star },
  { to: '/patient/profile', label: 'Profile', icon: UserCircle },
]
