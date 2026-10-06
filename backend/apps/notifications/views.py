from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-timestamp")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", NotificationViewSet, basename="notification")

urlpatterns = [
    path("", include(router.urls)),
]
