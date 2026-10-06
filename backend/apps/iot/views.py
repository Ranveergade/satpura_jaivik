from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import IoTSensorDevice

class IoTSensorDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IoTSensorDevice
        fields = "__all__"

class IoTSensorDeviceViewSet(viewsets.ModelViewSet):
    queryset = IoTSensorDevice.objects.all().order_by("-last_sync")
    serializer_class = IoTSensorDeviceSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", IoTSensorDeviceViewSet, basename="iot")

urlpatterns = [
    path("", include(router.urls)),
]
