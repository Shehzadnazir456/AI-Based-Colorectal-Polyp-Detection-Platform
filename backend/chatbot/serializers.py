from rest_framework import serializers

from chatbot.models import ChatMessage


class ChatAskSerializer(serializers.Serializer):
    question = serializers.CharField(required=False)
    message = serializers.CharField(required=False)

    def validate(self, attrs):
        text = attrs.get("question") or attrs.get("message")
        if not text:
            raise serializers.ValidationError("question or message is required.")
        attrs["question"] = text
        return attrs


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ("id", "question", "answer", "created_at")

