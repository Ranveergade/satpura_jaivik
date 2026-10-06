from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CCTVCameraViewSet

router = DefaultRouter()
router.register(r"", CCTVCameraViewSet, basename="cctv")

urlpatterns = [
    path("", include(router.urls)),
]
