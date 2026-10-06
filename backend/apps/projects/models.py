import uuid
from django.db import models
from django.conf import settings

class ProjectStatus(models.TextChoices):
    PLANNED = "PLANNED", "Planned"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    VERIFICATION = "VERIFICATION", "Under Verification"
    COMPLETED = "COMPLETED", "Completed"

class FarmProject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="farmer_projects")
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="supervised_projects")
    land_area_acres = models.DecimalField(max_digits=6, decimal_places=2, default=5.0)
    gps_lat = models.FloatField(default=22.75)
    gps_lng = models.FloatField(default=77.72)
    crop_type = models.CharField(max_length=100, default="Organic Rice")
    total_budget = models.DecimalField(max_digits=12, decimal_places=2, default=150000.00)
    allocated_subsidy = models.DecimalField(max_digits=12, decimal_places=2, default=45000.00)
    start_date = models.DateField()
    target_completion = models.DateField()
    status = models.CharField(max_length=30, choices=ProjectStatus.choices, default=ProjectStatus.IN_PROGRESS)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_code} - {self.title} ({self.status})"
