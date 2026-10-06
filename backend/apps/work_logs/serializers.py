from rest_framework import serializers
from .models import DailyWorkLog

class DailyWorkLogSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.ReadOnlyField(source="supervisor.full_name")
    project_code = serializers.ReadOnlyField(source="project.project_code")

    class Meta:
        model = DailyWorkLog
        fields = "__all__"
