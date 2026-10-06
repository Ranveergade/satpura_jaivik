import uuid
from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    action = models.CharField(max_length=150)
    entity = models.CharField(max_length=100)
    record_id = models.CharField(max_length=100, blank=True)
    ip_address = models.CharField(max_length=50, default="127.0.0.1")
    device_info = models.CharField(max_length=200, default="Mobile PWA / Chrome")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.entity} by {self.user.full_name if self.user else 'System'} at {self.timestamp}"
