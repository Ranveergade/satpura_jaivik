
from rest_framework import serializers
from django.utils import timezone
from .models import DailyWorkLog
from .models import LabourAttendance,Worker,ProjectWorkerAssignment
from django.db.models import Q

class WorkerSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True,
    )

    class Meta:
        model = Worker
        fields = [
            "id",
            "name",
            "phone_number",
            "skill",
            "daily_wage",
            "is_active",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Worker name cannot be empty."
            )
        return value

    def validate_phone_number(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Phone number cannot be empty."
            )
        return value

    def validate_daily_wage(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Daily wage cannot be negative."
            )
        return value

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
    worker_name = serializers.CharField(read_only=True, required=False)

    class Meta:
        model = LabourAttendance
        fields = [
            "id",
            "work_log",
            "worker",
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

    def validate(self, attrs):
        worker = attrs.get(
            "worker",
            getattr(self.instance, "worker", None),
        )
        work_log = attrs.get(
            "work_log",
            getattr(self.instance, "work_log", None),
        )

        if worker is None:
            # Allow legacy attendance records without a registered worker.
            worker_name = attrs.get(
                "worker_name",
                getattr(self.instance, "worker_name", ""),
            )
            if not worker_name or not worker_name.strip():
                raise serializers.ValidationError({
                    "worker": (
                        "Select a registered worker for new attendance "
                        "records."
                    ),
                    "worker_name": (
                        "A worker name is required for legacy records."
                    ),
                })
            attrs["worker_name"] = worker_name.strip()
            return attrs

        if not worker.is_active:
            raise serializers.ValidationError({
                "worker": "This worker is inactive."
            })

        if work_log is None:
            raise serializers.ValidationError({
                "work_log": "A daily work log is required."
            })

        assignment = ProjectWorkerAssignment.objects.filter(
            project_id=work_log.project_id,
            worker=worker,
            is_active=True,
            start_date__lte=work_log.work_date,
        ).filter(
            Q(end_date__isnull=True) 
            | Q(end_date__gte=work_log.work_date)
        ).exists()

        if not assignment:
            raise serializers.ValidationError({
                "worker": (
                    "This worker does not have an active assignment "
                    "to this project on the work date."
                )
            })

        attrs["worker_name"] = worker.name
        return attrs

    def create(self, validated_data):
        validated_data.pop("worker_name", None)
        worker = validated_data.get("worker")
        if worker is not None:
            validated_data["worker_name"] = worker.name
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("worker_name", None)
        worker = validated_data.get("worker", instance.worker)
        if worker is not None:
            validated_data["worker_name"] = worker.name
        return super().update(instance, validated_data)


class ProjectWorkerAssignmentSerializer(serializers.ModelSerializer):
    worker_name = serializers.CharField(
        source="worker.name",
        read_only=True,
    )
    project_name = serializers.SerializerMethodField()
    assigned_by_username = serializers.CharField(
        source="assigned_by.username",
        read_only=True,
    )

    class Meta:
        model = ProjectWorkerAssignment
        fields = [
            "id",
            "project",
            "project_name",
            "worker",
            "worker_name",
            "assigned_by",
            "assigned_by_username",
            "start_date",
            "end_date",
            "agreed_daily_wage",
            "is_active",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "assigned_by",
            "assigned_by_username",
            "created_at",
        ]

    def validate(self, attrs):
        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )
        end_date = attrs.get(
            "end_date",
            getattr(self.instance, "end_date", None),
        )
        wage = attrs.get(
            "agreed_daily_wage",
            getattr(self.instance, "agreed_daily_wage", None),
        )

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be before start date."
            })

        if wage is not None and wage < 0:
            raise serializers.ValidationError({
                "agreed_daily_wage": "Wage cannot be negative."
            })

        return attrs

    def get_project_name(self, obj):
        crop = (getattr(obj.project, "crop_type", "") or "").strip()
        label = f"Project #{obj.project_id}"
        return f"{label} - {crop}" if crop else label



from decimal import Decimal


class ProjectLabourSummarySerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    work_date = serializers.DateField()
    present_count = serializers.IntegerField()
    half_day_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    total_recorded = serializers.IntegerField()
    labour_cost = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
