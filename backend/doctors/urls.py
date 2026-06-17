from django.urls import path

from doctors.views import (
    doctor_add_history_view,
    doctor_delete_report_view,
    doctor_get_messages_view,
    doctor_patient_detail_view,
    doctor_patients_view,
    doctor_profile_update_view,
    doctor_profile_view,
    doctor_send_message_view,
    doctor_upload_report_view,
)

urlpatterns = [
    path("profile/", doctor_profile_view, name="doctor-profile"),
    path("profile/update/", doctor_profile_update_view, name="doctor-profile-update"),
    path("patients/", doctor_patients_view, name="doctor-patients"),
    path("patient/<int:patient_id>/", doctor_patient_detail_view, name="doctor-patient-detail"),
    path("patient/<int:patient_id>/history/add/", doctor_add_history_view, name="doctor-add-history"),
    path("patient/<int:patient_id>/report/upload/", doctor_upload_report_view, name="doctor-upload-report"),
    path("patient/<int:patient_id>/messages/", doctor_get_messages_view, name="doctor-get-messages"),
    path("patient/<int:patient_id>/messages/send/", doctor_send_message_view, name="doctor-send-message"),
    path("report/delete/<int:report_id>/", doctor_delete_report_view, name="doctor-delete-report"),
]