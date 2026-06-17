from rest_framework import serializers

from doctors.models import DoctorProfile
from patients.models import MedicalHistory, PatientProfile, Report
from patients.serializers import MedicalHistorySerializer, ReportSerializer

from doctors.models import Message  # add to existing import if needed

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender_role', 'message', 'created_at']
        
class DoctorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", required=False)
    last_name = serializers.CharField(source="user.last_name", required=False)

    class Meta:
        model = DoctorProfile
        fields = (
            "id",
            "specialization",
            "hospital",
            "experience",
            "email",
            "first_name",
            "last_name",
        )
        read_only_fields = ("id", "email")

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save(update_fields=list(user_data.keys()))
        return instance


class PatientListItemSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")

    class Meta:
        model = PatientProfile
        fields = ("id", "first_name", "last_name", "email", "age", "gender", "phone")


class PatientDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    history = MedicalHistorySerializer(source="histories", many=True, read_only=True)
    reports = ReportSerializer(many=True, read_only=True)

    class Meta:
        model = PatientProfile
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "age",
            "gender",
            "phone",
            "address",
            "history",
            "reports",
        )


class MedicalHistoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = ("disease", "medications", "allergies", "notes")


class ReportUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("id", "image", "result", "created_at")
        read_only_fields = ("id", "result", "created_at")


