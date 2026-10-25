
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from accounts.permissions import IsProjectViewer
from auditlog.models import AuditLog
from auditlog.utils import record_audit
from projects.models import Project
from django.db import IntegrityError
from .models import DailyWorkLog,LabourAttendance
from .serializers import DailyWorkLogSerializer,LabourAttendanceSerializer


ADMIN_ROLES = {"SUPER_ADMINISTRATOR", "ADMINISTRATOR"}


def visible_work_logs(user):
    logs = DailyWorkLog.objects.select_related(
        "project",
        "supervisor",
    )

    if user.role in ADMIN_ROLES:
        return logs

    if user.role == "SUPERVISOR":
        return logs.filter(
            project__supervisor=user,
            project__in=Project.objects.filter(supervisor=user),
        )

    return logs.none()


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def daily_work_log_list_create(request):
    if request.method == "GET":
        logs = visible_work_logs(request.user)
        serializer = DailyWorkLogSerializer(logs, many=True)
        return Response(serializer.data)

    if request.user.role != "SUPERVISOR":
        return Response(
            {"error": "Only supervisors can submit daily work logs."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = DailyWorkLogSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    project = serializer.validated_data["project"]

    if project.supervisor_id != request.user.pk:
        return Response(
            {"error": "You can only log work for your assigned projects."},
            status=status.HTTP_403_FORBIDDEN,
        )

    work_log = serializer.save(supervisor=request.user)

    record_audit(
        action=AuditLog.Action.WORK_LOG_CREATED,
        user=request.user,
        request=request,
        entity_type="DailyWorkLog",
        record_id=work_log.pk,
        changes={
            "project_id": work_log.project_id,
            "work_date": str(work_log.work_date),
            "laborers_present": work_log.laborers_present,
        },
    )

    return Response(
        DailyWorkLogSerializer(work_log).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def daily_work_log_detail(request, log_id):
    work_log = visible_work_logs(request.user).filter(pk=log_id).first()

    if work_log is None:
        return Response(
            {"error": "Daily work log not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(DailyWorkLogSerializer(work_log).data)


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def labour_attendance_list_create(request):
    if request.method == "GET":
        records = LabourAttendance.objects.select_related(
            "work_log",
            "work_log__project",
            "recorded_by",
        )

        if request.user.role in ADMIN_ROLES:
            pass
        elif request.user.role == "SUPERVISOR":
            records = records.filter(
                work_log__project__supervisor=request.user,
            )
        else:
            return Response(
                {"error": "You are not authorized to view labour attendance."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = LabourAttendanceSerializer(records, many=True)
        return Response(serializer.data)

    if request.user.role != "SUPERVISOR":
        return Response(
            {"error": "Only supervisors can record labour attendance."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = LabourAttendanceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    work_log = serializer.validated_data["work_log"]

    if work_log.project.supervisor_id != request.user.pk:
        return Response(
            {"error": "You can only record attendance for your assigned projects."},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        attendance = serializer.save(recorded_by=request.user)
    except IntegrityError:
        return Response(
            {"error": "Attendance for this worker already exists in this work log."},
            status=status.HTTP_409_CONFLICT,
        )

    record_audit(
        action=AuditLog.Action.LABOUR_ATTENDANCE_CREATED,
        user=request.user,
        request=request,
        entity_type="LabourAttendance",
        record_id=attendance.pk,
        changes={
            "work_log_id": attendance.work_log_id,
            "worker_name": attendance.worker_name,
            "status": attendance.status,
        },
    )

    return Response(
        LabourAttendanceSerializer(attendance).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def labour_attendance_detail(request, attendance_id):
    record = LabourAttendance.objects.select_related(
        "work_log",
        "work_log__project",
        "recorded_by",
    ).filter(pk=attendance_id).first()

    if record is None:
        return Response(
            {"error": "Labour attendance record not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.user.role in ADMIN_ROLES:
        pass
    elif (
        request.user.role == "SUPERVISOR"
        and record.work_log.project.supervisor_id == request.user.pk
    ):
        pass
    else:
        return Response(
            {"error": "You are not authorized to view this attendance record."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(LabourAttendanceSerializer(record).data)
