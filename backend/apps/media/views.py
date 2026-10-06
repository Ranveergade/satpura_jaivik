from rest_framework import serializers, viewsets, permissions
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .models import ProjectMediaDocument

class ProjectMediaDocumentSerializer(serializers.ModelSerializer):
    uploader_name = serializers.ReadOnlyField(source="uploader.full_name")

    class Meta:
        model = ProjectMediaDocument
        fields = "__all__"

class ProjectMediaDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectMediaDocument.objects.all().order_by("-timestamp")
    serializer_class = ProjectMediaDocumentSerializer
    permission_classes = [permissions.AllowAny]

router = DefaultRouter()
router.register(r"", ProjectMediaDocumentViewSet, basename="media-document")
