from django.core.asgi import get_asgi_application
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "polyguard_backend.settings")

application = get_asgi_application()

