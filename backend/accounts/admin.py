from django.contrib import admin

from accounts.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "role", "is_staff", "is_active", "created_at")
    search_fields = ("username", "email", "first_name", "last_name")
    list_filter = ("role", "is_staff", "is_active", "created_at")
    ordering = ("-created_at",)

