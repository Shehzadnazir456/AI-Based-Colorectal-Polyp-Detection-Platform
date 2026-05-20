from django.conf import settings
from django.db import models


class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctor_profile")
    specialization = models.CharField(max_length=120, blank=True)
    hospital = models.CharField(max_length=180, blank=True)
    experience = models.PositiveIntegerField(default=0, help_text="Years of experience")

    def __str__(self):
        return f"DoctorProfile<{self.user.username}>"

