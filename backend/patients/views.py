from django.http import FileResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsPatient
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

