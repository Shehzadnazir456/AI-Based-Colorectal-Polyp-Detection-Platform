from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from doctors.models import DoctorProfile


@receiver(post_save, sender=User)
def create_role_profile(sender, instance: User, created: bool, **kwargs):
    if not created:
        return
    if instance.role == User.Roles.DOCTOR:
        DoctorProfile.objects.get_or_create(user=instance)

