from rest_framework import viewsets, permissions
from .models import DailyWorkLog
from .serializers import DailyWorkLogSerializer

class DailyWorkLogViewSet(viewsets.ModelViewSet):
    queryset = DailyWorkLog.objects.all().order_by("-created_at")
    serializer_class = DailyWorkLogSerializer
    permission_classes = [permissions.AllowAny]
