
from django.contrib import admin

from .models import DailyWorkLog, LabourAttendance


@admin.register(DailyWorkLog)
class DailyWorkLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "project",
        "supervisor",
        "work_date",
        "laborers_present",
        "created_at",
    )
    list_filter = ("work_date", "created_at")
    search_fields = (
        "project__crop_type",
        "supervisor__username",
        "activities",
        "observations",
    )
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-work_date", "-created_at")
    list_per_page = 25


@admin.register(LabourAttendance)
class LabourAttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "worker_name",
        "work_log",
        "status",
        "recorded_by",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "worker_name",
        "recorded_by__username",
        "work_log__project__crop_type",
    )
    readonly_fields = ("created_at",)
    ordering = ("worker_name",)
    list_per_page = 25
