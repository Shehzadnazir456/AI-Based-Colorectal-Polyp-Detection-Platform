from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
  path("admin/", admin.site.urls),
  path("api/accounts/", include("accounts.urls")),
  path("api/patient/", include("patients.urls")),
  path("api/doctor/", include("doctors.urls")),
  path("api/chatbot/", include("chatbot.urls")),
  path("api/notifications/", include("notifications.urls")),
  path("api/feedback/", include("feedback.urls")),
]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

