from django.contrib import admin

from patients.models import MedicalHistory, PatientProfile, Report


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "age", "gender", "phone")
    search_fields = ("user__username", "user__email", "phone")
    list_filter = ("gender",)


@admin.register(MedicalHistory)
class MedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "patient", "disease", "created_at")
    search_fields = ("patient__user__username", "disease", "notes")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "patient", "created_at")
    search_fields = ("patient__user__username", "patient__user__email")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

