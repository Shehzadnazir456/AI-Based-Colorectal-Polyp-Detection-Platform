from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from patients.models import PatientProfile


@receiver(post_save, sender=User)
def create_patient_profile(sender, instance: User, created: bool, **kwargs):
    if created and instance.role == User.Roles.PATIENT:
        PatientProfile.objects.get_or_create(user=instance)

