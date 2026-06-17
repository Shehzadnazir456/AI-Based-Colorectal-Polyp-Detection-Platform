from rest_framework import serializers

from patients.models import MedicalHistory, PatientProfile, Report


class PatientProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", required=False)
    last_name = serializers.CharField(source="user.last_name", required=False)

    class Meta:
        model = PatientProfile
        fields = ("id", "age", "gender", "phone", "address", "email", "first_name", "last_name")

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


class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = ("id", "disease", "medications", "allergies", "notes", "created_at")
        read_only_fields = ("id", "created_at")

class ReportSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    result    = serializers.JSONField()   # ✅ explicitly serialize as JSON

    class Meta:
        model = Report
        fields = ("id", "image", "image_url", "result", "created_at")
        read_only_fields = ("id", "created_at", "result", "image_url")

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return ""
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
