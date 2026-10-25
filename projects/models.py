
from django.conf import settings
from django.db import models


class Project(models.Model):

    class Status(models.TextChoices):
        PLANNED = "PLANNED", "Planned"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        ON_HOLD = "ON_HOLD", "On Hold"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="farmer_projects",
        limit_choices_to={"role": "FARMER"},
    )

    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="supervised_projects",
        limit_choices_to={"role": "SUPERVISOR"},
    )

    land_details = models.TextField()
    land_area = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    crop_type = models.CharField(max_length=100)

    project_budget = models.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
    subsidy_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )
    loan_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    start_date = models.DateField()
    estimated_completion_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Project #{self.pk} - {self.crop_type}"
