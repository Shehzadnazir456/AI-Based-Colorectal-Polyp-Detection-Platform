from django.urls import path

from chatbot.views import ask_chatbot_view, chatbot_history_view

urlpatterns = [
    path("ask/", ask_chatbot_view, name="chatbot-ask"),
    path("history/", chatbot_history_view, name="chatbot-history"),
]

