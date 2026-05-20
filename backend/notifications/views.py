from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.models import Notification
from notifications.serializers import NotificationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notifications_list_view(request):
    queryset = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def notifications_mark_read_view(request, notification_id: int):
    obj = Notification.objects.filter(id=notification_id, user=request.user).first()
    if not obj:
        return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
    obj.is_read = True
    obj.save(update_fields=["is_read"])
    return Response(NotificationSerializer(obj).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def notifications_delete_view(request, notification_id: int):
    obj = Notification.objects.filter(id=notification_id, user=request.user).first()
    if not obj:
        return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

