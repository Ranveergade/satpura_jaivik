from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.full_name")

    class Meta:
        model = AuditLog
        fields = "__all__"

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all().order_by("-timestamp")
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", AuditLogViewSet, basename="audit")

urlpatterns = [
    path("", include(router.urls)),
]
