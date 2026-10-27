
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





class Worker(models.Model):
    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15, db_index=True)
    skill = models.CharField(max_length=100, blank=True)
    daily_wage = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="registered_workers",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["is_active", "name"]),
        ]

    def __str__(self):
        return f"{self.name} - ₹{self.daily_wage}/day"

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
    worker = models.ForeignKey(
        "worklogs.Worker",
        on_delete=models.PROTECT,
        related_name="attendance_records",
        null=True,
        blank=True,
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

class ProjectWorkerAssignment(models.Model):
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.PROTECT,
        related_name="worker_assignments",
    )
    worker = models.ForeignKey(
        Worker,
        on_delete=models.PROTECT,
        related_name="project_assignments",
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="worker_assignments_created",
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    agreed_daily_wage = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(end_date__isnull=True)
                    | models.Q(end_date__gte=models.F("start_date"))
                ),
                name="assignment_end_after_start",
            ),
            models.CheckConstraint(
                condition=models.Q(agreed_daily_wage__gte=0),
                name="assignment_wage_nonnegative",
            ),
        ]
        indexes = [
            models.Index(fields=["project", "is_active"]),
            models.Index(fields=["worker", "is_active"]),
        ]

    def __str__(self):
        return f"{self.worker.name} -> {self.project}"
