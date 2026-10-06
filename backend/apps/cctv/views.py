from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import CCTVCamera

class CCTVCameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCTVCamera
        fields = "__all__"

class CCTVCameraViewSet(viewsets.ModelViewSet):
    queryset = CCTVCamera.objects.all().order_by("-created_at")
    serializer_class = CCTVCameraSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", CCTVCameraViewSet, basename="cctv")

urlpatterns = [
    path("", include(router.urls)),
]
