from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmerProfileViewSet

router = DefaultRouter()
router.register(r"", FarmerProfileViewSet, basename="farmer")

urlpatterns = [
    path("", include(router.urls)),
]
