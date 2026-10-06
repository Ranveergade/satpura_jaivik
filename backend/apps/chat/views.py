from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source="sender.full_name")
    receiver_name = serializers.ReadOnlyField(source="receiver.full_name")

    class Meta:
        model = ChatMessage
        fields = "__all__"

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().order_by("timestamp")
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", ChatMessageViewSet, basename="chat")

urlpatterns = [
    path("", include(router.urls)),
]
