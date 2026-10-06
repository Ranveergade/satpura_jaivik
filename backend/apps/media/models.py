import uuid
from django.db import models
from django.conf import settings
from apps.projects.models import FarmProject

class MediaType(models.TextChoices):
    PHOTO = "PHOTO", "Photo"
    VIDEO = "VIDEO", "Video"
    DRONE = "DRONE", "Drone Imagery"
    DOCUMENT = "DOCUMENT", "Document"

class ProjectMediaDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(FarmProject, on_delete=models.CASCADE, related_name="media_documents")
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="uploaded_media")
    media_type = models.CharField(max_length=30, choices=MediaType.choices, default=MediaType.PHOTO)
    title = models.CharField(max_length=200)
    file_url = models.TextField()
    gps_lat = models.FloatField(default=22.75)
    gps_lng = models.FloatField(default=77.72)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.media_type}: {self.title} ({self.project.project_code})"
