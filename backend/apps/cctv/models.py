import uuid
from django.db import models
from apps.projects.models import FarmProject

class CCTVCamera(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(FarmProject, on_delete=models.CASCADE, related_name="cctv_cameras")
    camera_name = models.CharField(max_length=150)
    stream_url = models.TextField()
    vendor_name = models.CharField(max_length=100, default="CP PLUS Hikvision")
    status = models.CharField(max_length=20, default="ONLINE")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.camera_name} - {self.project.project_code} ({self.status})"
