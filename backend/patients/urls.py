from django.urls import path

from patients.views import (
    patient_history_view,
    patient_profile_update_view,
    patient_profile_view,
    patient_reports_view,
    report_download_view,
)

urlpatterns = [
    path("profile/", patient_profile_view, name="patient-profile"),
    path("profile/update/", patient_profile_update_view, name="patient-profile-update"),
    path("history/", patient_history_view, name="patient-history"),
    path("reports/", patient_reports_view, name="patient-reports"),
    path("report/download/<int:report_id>/", report_download_view, name="patient-report-download"),
]

