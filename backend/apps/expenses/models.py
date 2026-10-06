import uuid
from django.db import models
from django.conf import settings
from apps.projects.models import FarmProject

class ExpenseCategory(models.TextChoices):
    LABOUR = "LABOUR", "Labour"
    SEEDS = "SEEDS", "Seeds"
    FERTILIZER = "FERTILIZER", "Fertilizer"
    IRRIGATION = "IRRIGATION", "Irrigation"
    MACHINERY = "MACHINERY", "Machinery"
    TRANSPORT = "TRANSPORT", "Transport"
    CONSTRUCTION = "CONSTRUCTION", "Construction"
    COCOPEAT = "COCOPEAT", "Cocopeat"
    MISC = "MISC", "Miscellaneous"

class ExpenseStatus(models.TextChoices):
    SUBMITTED = "SUBMITTED", "Submitted"
    ACCOUNTS_VERIFIED = "ACCOUNTS_VERIFIED", "Verified by Accounts"
    ADMIN_APPROVED = "ADMIN_APPROVED", "Approved by Admin"
    PAID = "PAID", "Payment Processed & Visible to Farmer"
    REJECTED = "REJECTED", "Rejected"

class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(FarmProject, on_delete=models.CASCADE, related_name="expenses")
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submitted_expenses")
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=ExpenseCategory.choices, default=ExpenseCategory.MISC)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_date = models.DateField()
    vendor_name = models.CharField(max_length=150, blank=True)
    gst_number = models.CharField(max_length=30, blank=True)
    bill_image_url = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=ExpenseStatus.choices, default=ExpenseStatus.SUBMITTED)
    verification_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - ₹{self.amount} ({self.status})"
