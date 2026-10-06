from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.full_name")

    class Meta:
        model = AuditLog
        fields = "__all__"
