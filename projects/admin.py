
from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "farmer",
        "supervisor",
        "crop_type",
        "status",
        "start_date",
        "estimated_completion_date",
    )

    list_filter = ("status", "crop_type")

    search_fields = (
        "farmer__username",
        "supervisor__username",
        "crop_type",
    )

    readonly_fields = ("created_at", "updated_at")
