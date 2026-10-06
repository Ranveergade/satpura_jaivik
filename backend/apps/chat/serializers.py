from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source="sender.full_name")
    receiver_name = serializers.ReadOnlyField(source="receiver.full_name")

    class Meta:
        model = ChatMessage
        fields = "__all__"
