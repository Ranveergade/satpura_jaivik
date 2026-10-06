from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyWorkLogViewSet

router = DefaultRouter()
router.register(r"", DailyWorkLogViewSet, basename="work-log")

urlpatterns = [
    path("", include(router.urls)),
]
