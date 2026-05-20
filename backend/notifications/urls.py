from django.urls import path

from notifications.views import (
    notifications_delete_view,
    notifications_list_view,
    notifications_mark_read_view,
)

urlpatterns = [
    path("", notifications_list_view, name="notifications-list"),
    path("read/<int:notification_id>/", notifications_mark_read_view, name="notifications-mark-read"),
    path("delete/<int:notification_id>/", notifications_delete_view, name="notifications-delete"),
]

