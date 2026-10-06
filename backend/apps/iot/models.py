import uuid
from django.db import models
from apps.projects.models import FarmProject

class IoTSensorDevice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(FarmProject, on_delete=models.CASCADE, related_name="iot_devices")
    device_name = models.CharField(max_length=150)
    device_type = models.CharField(max_length=50, default="SOIL_MOISTURE")
    current_reading = models.DecimalField(max_digits=8, decimal_places=2, default=38.5)
    unit = models.CharField(max_length=20, default="%")
    is_active = models.BooleanField(default=True)
    last_sync = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.device_name} ({self.device_type}): {self.current_reading}{self.unit}"
