from django.urls import path

from feedback.views import all_feedback_view, delete_feedback_view, my_feedback_view, submit_feedback_view

urlpatterns = [
    path("submit/", submit_feedback_view, name="feedback-submit"),
    path("my/", my_feedback_view, name="feedback-my"),
    path("all/", all_feedback_view, name="feedback-all"),
    path("delete/<int:feedback_id>/", delete_feedback_view, name="feedback-delete"),
]

