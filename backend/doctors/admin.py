from django.contrib import admin

from doctors.models import DoctorProfile


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "specialization", "hospital", "experience")
    search_fields = ("user__username", "user__email", "specialization", "hospital")
    list_filter = ("specialization", "hospital")

