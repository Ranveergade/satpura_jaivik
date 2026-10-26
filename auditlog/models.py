
from django.conf import settings
from django.db import models


class AuditLog(models.Model):

    class Action(models.TextChoices):
        LOGIN_SUCCESS = "LOGIN_SUCCESS", "Successful Login"
        LOGIN_FAILED = "LOGIN_FAILED", "Failed Login"
        LOGOUT = "LOGOUT", "Logout"
        OTP_VERIFIED = "OTP_VERIFIED", "OTP Verified"
        OTP_FAILED = "OTP_FAILED", "OTP Verification Failed"
        PROJECT_CREATED = "PROJECT_CREATED", "Project Created"
        PROJECT_UPDATED = "PROJECT_UPDATED", "Project Updated"
        WORK_LOG_CREATED = "WORK_LOG_CREATED", "Daily Work Log Created"
        LABOUR_ATTENDANCE_CREATED = (
                "LABOUR_ATTENDANCE_CREATED",
                "Labour Attendance Created",
            )
        EXPENSE_CREATED = "EXPENSE_CREATED", "Expense Created"
        EXPENSE_REVIEWED = "EXPENSE_REVIEWED", "Expense Reviewed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )

    action = models.CharField(
        max_length=40,
        choices=Action.choices,
    )

    entity_type = models.CharField(
        max_length=100,
        blank=True,
    )

    record_id = models.CharField(
        max_length=100,
        blank=True,
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.CharField(
        max_length=500,
        blank=True,
    )

    changes = models.JSONField(
        default=dict,
        blank=True,
    )

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action} | User: {self.user_id} | {self.timestamp}"
