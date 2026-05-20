from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from feedback.models import Feedback
from feedback.serializers import FeedbackSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_feedback_view(request):
    payload = {
        "rating": request.data.get("rating"),
        "message": request.data.get("message") or request.data.get("comments") or "",
    }
    serializer = FeedbackSerializer(data=payload)
    serializer.is_valid(raise_exception=True)
    obj = serializer.save(user=request.user)
    return Response(FeedbackSerializer(obj).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_feedback_view(request):
    queryset = Feedback.objects.filter(user=request.user)
    serializer = FeedbackSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def all_feedback_view(request):
    queryset = Feedback.objects.select_related("user").all()
    serializer = FeedbackSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_feedback_view(request, feedback_id: int):
    queryset = Feedback.objects.filter(id=feedback_id)
    obj = queryset.filter(user=request.user).first()
    if not obj and request.user.is_staff:
        obj = queryset.first()
    if not obj:
        return Response({"detail": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

