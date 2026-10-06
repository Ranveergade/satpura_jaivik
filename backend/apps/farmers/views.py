from rest_framework import viewsets, permissions
from .models import FarmerProfile
from .serializers import FarmerProfileSerializer

class FarmerProfileViewSet(viewsets.ModelViewSet):
    queryset = FarmerProfile.objects.all().order_by("-created_at")
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.AllowAny]
