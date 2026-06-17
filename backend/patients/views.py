from django.http import FileResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsPatient
from doctors.models import DoctorProfile, Message
from doctors.serializers import MessageSerializer
from patients.models import PatientProfile, Report
from patients.serializers import MedicalHistorySerializer, PatientProfileSerializer, ReportSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_profile_view(request):
    profile = PatientProfile.objects.get(user=request.user)
    serializer = PatientProfileSerializer(profile)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_profile_update_view(request):
    profile = PatientProfile.objects.get(user=request.user)
    serializer = PatientProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_history_view(request):
    profile = PatientProfile.objects.get(user=request.user)
    serializer = MedicalHistorySerializer(profile.histories.all(), many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_reports_view(request):
    profile = PatientProfile.objects.get(user=request.user)
    serializer = ReportSerializer(profile.reports.all(), many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def report_download_view(request, report_id: int):
    profile = PatientProfile.objects.get(user=request.user)
    report = Report.objects.filter(id=report_id, patient=profile).first()
    if not report or not report.image:
        raise Http404("Report not found.")
    return FileResponse(report.image.open("rb"), as_attachment=True, filename=report.image.name.split("/")[-1])


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_get_messages_view(request):
    profile = PatientProfile.objects.get(user=request.user)
    # get all messages where this patient is involved, across all doctors
    messages = Message.objects.filter(patient=profile).order_by('created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsPatient])
def patient_send_message_view(request):
    profile = PatientProfile.objects.get(user=request.user)

    text = request.data.get("message", "").strip()
    if not text:
        return Response({"detail": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    # find the most recent doctor who messaged this patient, or first available doctor
    last_msg = Message.objects.filter(patient=profile).order_by('-created_at').first()
    if last_msg:
        doctor = last_msg.doctor
    else:
        doctor = DoctorProfile.objects.first()

    if not doctor:
        return Response({"detail": "No doctor assigned."}, status=status.HTTP_400_BAD_REQUEST)

    msg = Message.objects.create(
        doctor=doctor,
        patient=profile,
        sender_role="patient",
        message=text,
    )

    from notifications.utils import create_notification
    create_notification(
        user=doctor.user,
        title="New message from patient",
        message=text[:100],
    )
    return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)