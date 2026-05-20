from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chatbot.models import ChatMessage
from chatbot.serializers import ChatAskSerializer, ChatMessageSerializer
from chatbot.utils import ask_openai


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ask_chatbot_view(request):
    serializer = ChatAskSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    question = serializer.validated_data["question"]
    answer = ask_openai(question)
    obj = ChatMessage.objects.create(user=request.user, question=question, answer=answer)
    return Response(
        {
            "id": obj.id,
            "question": obj.question,
            "answer": obj.answer,
            "created_at": obj.created_at,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chatbot_history_view(request):
    queryset = ChatMessage.objects.filter(user=request.user)
    serializer = ChatMessageSerializer(queryset, many=True)
    return Response(serializer.data)

