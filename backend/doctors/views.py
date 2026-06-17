from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsDoctor
from doctors.ai_model import run_ai_model
from doctors.models import DoctorProfile, Message
from doctors.serializers import (
    DoctorProfileSerializer,
    MedicalHistoryCreateSerializer,
    MessageSerializer,
    PatientDetailSerializer,
    PatientListItemSerializer,
    ReportUploadSerializer,
)
from notifications.utils import create_notification
from patients.models import PatientProfile, Report
from patients.serializers import MedicalHistorySerializer, ReportSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_profile_view(request):
    profile = DoctorProfile.objects.get(user=request.user)
    serializer = DoctorProfileSerializer(profile)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_profile_update_view(request):
    profile = DoctorProfile.objects.get(user=request.user)
    serializer = DoctorProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_patients_view(request):
    queryset = PatientProfile.objects.select_related("user").all().order_by("user__username")
    serializer = PatientListItemSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_patient_detail_view(request, patient_id: int):
    patient = PatientProfile.objects.select_related("user").filter(id=patient_id).first()
    if not patient:
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = PatientDetailSerializer(patient, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_add_history_view(request, patient_id: int):
    patient = PatientProfile.objects.filter(id=patient_id).first()
    if not patient:
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = MedicalHistoryCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    history = serializer.save(patient=patient)

    create_notification(
        user=patient.user,
        title="Medical history updated",
        message="Your doctor added a new medical history entry.",
    )
    return Response(MedicalHistorySerializer(history).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_upload_report_view(request, patient_id: int):
    patient = PatientProfile.objects.filter(id=patient_id).first()
    if not patient:
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReportUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    report = serializer.save(patient=patient)

    result = run_ai_model(report.image)
    report.result = result
    report.save(update_fields=["result"])

    # If the image was invalid, delete the report and return a clear error
    if result.get("error"):
        report.delete()
        return Response(
            {"detail": result["error_message"]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    create_notification(
        user=patient.user,
        title="New AI report available",
        message="A new report was uploaded and analyzed.",
    )
    return Response(
        ReportSerializer(report, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_delete_report_view(request, report_id: int):
    report = Report.objects.filter(id=report_id).first()
    if not report:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    create_notification(
        user=report.patient.user,
        title="Report removed",
        message=f"Report #{report.id} has been deleted by your doctor.",
    )
    report.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_get_messages_view(request, patient_id: int):
    doctor = DoctorProfile.objects.get(user=request.user)
    patient = PatientProfile.objects.filter(id=patient_id).first()
    if not patient:
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    messages = Message.objects.filter(doctor=doctor, patient=patient)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_send_message_view(request, patient_id: int):
    doctor = DoctorProfile.objects.get(user=request.user)
    patient = PatientProfile.objects.filter(id=patient_id).first()
    if not patient:
        return Response({"detail": "Patient not found."}, status=status.HTTP_404_NOT_FOUND)

    text = request.data.get("message", "").strip()
    if not text:
        return Response({"detail": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    msg = Message.objects.create(
        doctor=doctor,
        patient=patient,
        sender_role="doctor",
        message=text,
    )

    create_notification(
        user=patient.user,
        title="New message from your doctor",
        message=text[:100],
    )
    return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)