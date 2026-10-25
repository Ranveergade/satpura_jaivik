
from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "timestamp",
        "user",
        "action",
        "entity_type",
        "record_id",
        "ip_address",
    )

    list_filter = ("action", "entity_type", "timestamp")
    search_fields = ("user__username", "record_id", "entity_type")
    ordering = ("-timestamp",)
    readonly_fields = (
        "user",
        "action",
        "entity_type",
        "record_id",
        "timestamp",
        "ip_address",
        "user_agent",
        "changes",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
