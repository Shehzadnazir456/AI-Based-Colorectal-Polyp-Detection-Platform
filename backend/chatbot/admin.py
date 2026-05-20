from django.contrib import admin

from chatbot.models import ChatMessage


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    search_fields = ("user__username", "question", "answer")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

