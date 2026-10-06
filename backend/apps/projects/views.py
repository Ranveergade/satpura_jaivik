from rest_framework import viewsets, permissions
from .models import FarmProject
from .serializers import FarmProjectSerializer

class FarmProjectViewSet(viewsets.ModelViewSet):
    queryset = FarmProject.objects.all().order_by("-created_at")
    serializer_class = FarmProjectSerializer
    permission_classes = [permissions.AllowAny]
