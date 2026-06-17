from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        DOCTOR = "doctor", "Doctor"
        PATIENT = "patient", "Patient"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ["email", "role"]

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"

