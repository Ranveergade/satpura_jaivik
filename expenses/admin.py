
from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "project",
        "category",
        "amount",
        "status",
        "submitted_by",
        "reviewed_by",
        "expense_date",
    )

    list_filter = (
        "status",
        "category",
        "expense_date",
    )

    search_fields = (
        "description",
        "project__crop_type",
        "submitted_by__username",
        "reviewed_by__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = ("-created_at",)
    list_per_page = 25
