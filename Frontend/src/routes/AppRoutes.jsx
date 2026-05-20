import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isDoctor, isPatient } from '../utils/authHelpers.js'
import { ProtectedRoute } from './ProtectedRoute.jsx'

import { AuthLayout } from '../layouts/AuthLayout.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import PublicLayout from '../layouts/PublicLayout.jsx'

import { LoginPage } from '../pages/auth/LoginPage.jsx'
import { RegisterPage } from '../pages/auth/RegisterPage.jsx'

import HomePage from '../pages/home/HomePage.jsx'
import AboutPage from '../pages/home/AboutPage.jsx'
import ContactPage from '../pages/home/ContactPage.jsx'

import { DoctorDashboard } from '../pages/doctor/DoctorDashboard.jsx'
import { PatientsListPage } from '../pages/doctor/PatientsListPage.jsx'
import { PatientDetailPage } from '../pages/doctor/PatientDetailPage.jsx'
import { UploadReportPage } from '../pages/doctor/UploadReportPage.jsx'
import { AIResultPage } from '../pages/doctor/AIResultPage.jsx'
import { DoctorNotificationsPage } from '../pages/doctor/DoctorNotificationsPage.jsx'
import { DoctorChatbotPage } from '../pages/doctor/DoctorChatbotPage.jsx'
import { DoctorFeedbackPage } from '../pages/doctor/DoctorFeedbackPage.jsx'
import { DoctorProfilePage } from '../pages/doctor/DoctorProfilePage.jsx'

import { PatientDashboard } from '../pages/patient/PatientDashboard.jsx'
import { PatientReportsPage } from '../pages/patient/PatientReportsPage.jsx'
import { PatientHistoryPage } from '../pages/patient/PatientHistoryPage.jsx'
import { PatientNotificationsPage } from '../pages/patient/PatientNotificationsPage.jsx'
import { PatientChatbotPage } from '../pages/patient/PatientChatbotPage.jsx'
import { PatientFeedbackPage } from '../pages/patient/PatientFeedbackPage.jsx'
import { PatientProfilePage } from '../pages/patient/PatientProfilePage.jsx'

import { NotFoundPage } from '../pages/NotFoundPage.jsx'
import { ROLES } from '../utils/constants.js'

export function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC (MUST BE FIRST) ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ================= DOCTOR ================= */}
      <Route
        element={
          <ProtectedRoute role={ROLES.DOCTOR}>
            <DashboardLayout variant="doctor" />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientsListPage />} />
        <Route path="/doctor/patients/:patientId" element={<PatientDetailPage />} />
        <Route path="/doctor/patients/:patientId/upload" element={<UploadReportPage />} />
        <Route path="/doctor/patients/:patientId/result/:reportId?" element={<AIResultPage />} />
        <Route path="/doctor/notifications" element={<DoctorNotificationsPage />} />
        <Route path="/doctor/chatbot" element={<DoctorChatbotPage />} />
        <Route path="/doctor/feedback" element={<DoctorFeedbackPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Route>

      {/* ================= PATIENT ================= */}
      <Route
        element={
          <ProtectedRoute role={ROLES.PATIENT}>
            <DashboardLayout variant="patient" />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/reports" element={<PatientReportsPage />} />
        <Route path="/patient/history" element={<PatientHistoryPage />} />
        <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
        <Route path="/patient/chatbot" element={<PatientChatbotPage />} />
        <Route path="/patient/feedback" element={<PatientFeedbackPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}