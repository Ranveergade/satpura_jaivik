from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmProjectViewSet

router = DefaultRouter()
router.register(r"", FarmProjectViewSet, basename="project")

urlpatterns = [
    path("", include(router.urls)),
]
