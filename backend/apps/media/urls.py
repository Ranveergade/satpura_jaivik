from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectMediaDocumentViewSet

router = DefaultRouter()
router.register(r"", ProjectMediaDocumentViewSet, basename="media")

urlpatterns = [
    path("", include(router.urls)),
]
