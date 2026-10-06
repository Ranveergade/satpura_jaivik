from rest_framework import serializers
from .models import ProjectMediaDocument

class ProjectMediaDocumentSerializer(serializers.ModelSerializer):
    uploader_name = serializers.ReadOnlyField(source="uploader.full_name")

    class Meta:
        model = ProjectMediaDocument
        fields = "__all__"
