
from django.conf import settings
from django.db import models


class DailyWorkLog(models.Model):
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.PROTECT,
        related_name="daily_work_logs",
    )

    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="submitted_work_logs",
    )

    work_date = models.DateField()
    activities = models.TextField()
    laborers_present = models.PositiveIntegerField(default=0)
    observations = models.TextField(blank=True)

    check_in_latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    check_in_longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-work_date", "-created_at"]

    def __str__(self):
        return (
            f"Work Log #{self.pk} | "
            f"Project #{self.project_id} | "
            f"{self.work_date}"
        )


class LabourAttendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        HALF_DAY = "HALF_DAY", "Half Day"

    work_log = models.ForeignKey(
        DailyWorkLog,
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )

    worker_name = models.CharField(max_length=150)

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PRESENT,
    )

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="recorded_labour_attendance",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["worker_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["work_log", "worker_name"],
                name="unique_worker_per_work_log",
            ),
        ]

    def __str__(self):
        return (
            f"{self.worker_name} | "
            f"{self.status} | "
            f"Work Log #{self.work_log_id}"
        )
