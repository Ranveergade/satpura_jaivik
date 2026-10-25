
from rest_framework import serializers

from .models import DailyWorkLog
from .models import LabourAttendance


class DailyWorkLogSerializer(serializers.ModelSerializer):
    supervisor = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DailyWorkLog
        fields = [
            "id",
            "project",
            "supervisor",
            "work_date",
            "activities",
            "laborers_present",
            "observations",
            "check_in_latitude",
            "check_in_longitude",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "supervisor",
            "created_at",
            "updated_at",
        ]

    def validate_laborers_present(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Laborers present cannot be negative."
            )
        return value

    def validate(self, attrs):
        latitude = attrs.get("check_in_latitude")
        longitude = attrs.get("check_in_longitude")

        if (latitude is None) != (longitude is None):
            raise serializers.ValidationError(
                "Both GPS coordinates must be provided together."
            )

        if latitude is not None and not -90 <= latitude <= 90:
            raise serializers.ValidationError(
                "Latitude must be between -90 and 90."
            )

        if longitude is not None and not -180 <= longitude <= 180:
            raise serializers.ValidationError(
                "Longitude must be between -180 and 180."
            )

        return attrs


class LabourAttendanceSerializer(serializers.ModelSerializer):
    recorded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = LabourAttendance
        fields = [
            "id",
            "work_log",
            "worker_name",
            "status",
            "recorded_by",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "recorded_by",
            "created_at",
        ]

    def validate_worker_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Worker name cannot be empty."
            )

        return value
