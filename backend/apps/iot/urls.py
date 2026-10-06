from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IoTSensorDeviceViewSet

router = DefaultRouter()
router.register(r"", IoTSensorDeviceViewSet, basename="iot")

urlpatterns = [
    path("", include(router.urls)),
]
