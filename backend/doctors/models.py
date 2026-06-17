from django.conf import settings
from django.db import models


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(max_length=120, blank=True)
    hospital = models.CharField(max_length=180, blank=True)
    experience = models.PositiveIntegerField(default=0, help_text="Years of experience")

    def __str__(self):
        return f"DoctorProfile<{self.user.username}>"

class Message(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='messages')
    patient = models.ForeignKey('patients.PatientProfile', on_delete=models.CASCADE, related_name='messages')
    sender_role = models.CharField(max_length=10, choices=[('doctor', 'Doctor'), ('patient', 'Patient')])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender_role} → {self.created_at:%Y-%m-%d %H:%M}"
