from django.contrib import admin

from feedback.models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "rating", "created_at")
    search_fields = ("user__username", "user__email", "message")
    list_filter = ("rating", "created_at")
    ordering = ("-created_at",)

