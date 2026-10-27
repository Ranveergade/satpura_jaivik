
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Expense(models.Model):
    class Category(models.TextChoices):
        LABOUR = "LABOUR", "Labour"
        MATERIALS = "MATERIALS", "Materials"
        TRANSPORT = "TRANSPORT", "Transport"
        EQUIPMENT = "EQUIPMENT", "Equipment"
        SEEDS_AND_FERTILIZERS = (
            "SEEDS_AND_FERTILIZERS",
            "Seeds and Fertilizers",
        )
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.PROTECT,
        related_name="expenses",
    )

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="submitted_expenses",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal(0.01))],
    )

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
    )

    description = models.TextField()

    expense_date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="reviewed_expenses",
        null=True,
        blank=True,
    )

    review_note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-expense_date", "-created_at"]

    def __str__(self):
        return (
            f"Expense #{self.pk} | "
            f"{self.amount} | {self.status}"
        )
