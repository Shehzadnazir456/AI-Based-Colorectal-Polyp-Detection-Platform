from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chatbot.models import ChatMessage
from chatbot.serializers import ChatAskSerializer, ChatMessageSerializer
from chatbot.utils import ask_openai

import os
import logging
from groq import Groq, RateLimitError, APIError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from chatbot.utils import ask_openai

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_chatbot_view(request):
    question = request.data.get('question', '')
    if not question:
        return Response(
            {"error": "No question provided."},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        answer = ask_openai(question)
        return Response({"answer": answer}, status=status.HTTP_200_OK)
    except RateLimitError:
        return Response(
            {"error": "AI service quota exceeded. Please try again later."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except APIError as e:
        logger.error(f"Groq API error: {e}")
        return Response(
            {"error": "AI service error. Please try again."},
            status=status.HTTP_502_BAD_GATEWAY
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chatbot_history_view(request):
    return Response({"history": []}, status=status.HTTP_200_OK)
