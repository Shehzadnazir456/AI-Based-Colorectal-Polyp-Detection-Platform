import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar.jsx'
import { TopBar } from '../components/layout/TopBar.jsx'
import { doctorNav, patientNav } from './navConfig.js'

/**
 * Shared shell: gradient sidebar, top bar, scrollable main content area.
 */
export function DashboardLayout({ variant }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const items = variant === 'doctor' ? doctorNav : patientNav
  const roleLabel = variant === 'doctor' ? 'Clinician workspace' : 'Patient portal'
  const portalLabel = variant === 'doctor' ? 'Clinical Dashboard' : 'My Health'

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={items}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleLabel={roleLabel}
      />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} portalLabel={portalLabel} />
        <main className="flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
