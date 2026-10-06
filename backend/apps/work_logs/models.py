import uuid
from django.db import models
from django.conf import settings
from apps.projects.models import FarmProject

class DailyWorkLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(FarmProject, on_delete=models.CASCADE, related_name="work_logs")
    supervisor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="supervisor_work_logs")
    log_date = models.DateField()
    gps_checkin_lat = models.FloatField(default=22.75)
    gps_checkin_lng = models.FloatField(default=77.72)
    work_description = models.TextField()
    labor_count = models.IntegerField(default=1)
    site_expense_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    photo_urls = models.JSONField(default=list, blank=True)
    is_synced = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"WorkLog {self.log_date} - {self.project.project_code} ({self.supervisor.full_name})"
