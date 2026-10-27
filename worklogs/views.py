
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics
from accounts.permissions import IsProjectViewer
from auditlog.models import AuditLog
from auditlog.utils import record_audit
from projects.models import Project
from django.db import IntegrityError
from .models import DailyWorkLog,LabourAttendance
from .serializers import DailyWorkLogSerializer,LabourAttendanceSerializer
from .models import Worker
from .serializers import WorkerSerializer
from .permissions import CanManageWorkers
from django.db import transaction
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import ProjectWorkerAssignment, Worker
from .serializers import ProjectWorkerAssignmentSerializer
from decimal import Decimal
from django.db.models import Q
from rest_framework.views import APIView


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
            "worker",
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
        with transaction.atomic():
            attendance = serializer.save(recorded_by=request.user)

            record_audit(
                action=AuditLog.Action.LABOUR_ATTENDANCE_CREATED,
                user=request.user,
                request=request,
                entity_type="LabourAttendance",
                record_id=attendance.pk,
                changes={
                    "work_log_id": attendance.work_log_id,
                    "worker_id": attendance.worker_id,
                    "worker_name": attendance.worker_name,
                    "status": attendance.status,
                },
            )
    except IntegrityError:
        return Response(
            {"error": "Attendance for this worker already exists in this work log."},
            status=status.HTTP_409_CONFLICT,
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


class WorkerListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [CanManageWorkers]

    def get_queryset(self):
        queryset = Worker.objects.select_related("created_by")

        active = self.request.query_params.get("active")

        if active == "true":
            queryset = queryset.filter(is_active=True)
        elif active == "false":
            queryset = queryset.filter(is_active=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class WorkerDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = WorkerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [CanManageWorkers]
    queryset = Worker.objects.select_related("created_by")

    def perform_update(self, serializer):
        serializer.save(
            created_by=self.get_object().created_by
        )


class ProjectWorkerAssignmentListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ProjectWorkerAssignmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [CanManageWorkers]

    def get_queryset(self):
        queryset = ProjectWorkerAssignment.objects.select_related(
            "project", "worker", "assigned_by"
        )

        user = self.request.user

        if user.role == "SUPERVISOR":
            queryset = queryset.filter(project__supervisor=user)

        project_id = self.request.query_params.get("project")
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        worker_id = self.request.query_params.get("worker")
        if worker_id:
            queryset = queryset.filter(worker_id=worker_id)

        return queryset

    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        project = serializer.validated_data["project"]
        worker = serializer.validated_data["worker"]

        if user.role == "SUPERVISOR" and project.supervisor_id != user.id:
            raise PermissionDenied(
                "You can assign workers only to your projects."
            )

        if not worker.is_active:
            raise ValidationError(
                {"worker": "Inactive workers cannot be assigned."}
            )

        serializer.save(assigned_by=user)


class ProjectWorkerAssignmentDetailView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = ProjectWorkerAssignmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [CanManageWorkers]

    def get_queryset(self):
        queryset = ProjectWorkerAssignment.objects.select_related(
            "project", "worker", "assigned_by"
        )

        if self.request.user.role == "SUPERVISOR":
            queryset = queryset.filter(
                project__supervisor=self.request.user
            )

        return queryset

    @transaction.atomic
    def perform_update(self, serializer):
        assignment = self.get_object()
        user = self.request.user

        if (
            user.role == "SUPERVISOR"
            and assignment.project.supervisor_id != user.id
        ):
            raise PermissionDenied(
                "You cannot modify assignments for another supervisor's project."
            )

        if (
            "worker" in serializer.validated_data
            and not serializer.validated_data["worker"].is_active
        ):
            raise ValidationError(
                {"worker": "Inactive workers cannot be assigned."}
            )

        serializer.save(assigned_by=assignment.assigned_by)



class ProjectLabourSummaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsProjectViewer]

    def get(self, request):
        project_id = request.query_params.get("project")
        work_date = request.query_params.get("date")

        if not project_id or not work_date:
            return Response(
                {
                    "error": (
                        "Both project and date are required. "
                        "Example: ?project=1&date=2026-10-27"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            project = Project.objects.get(pk=project_id)
        except (Project.DoesNotExist, ValueError):
            return Response(
                {"error": "Project not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user.role not in ADMIN_ROLES:
            if (
                request.user.role != "SUPERVISOR"
                or project.supervisor_id != request.user.pk
            ):
                return Response(
                    {"error": "You cannot view this project's summary."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        from datetime import date

        try:
            parsed_date = date.fromisoformat(work_date)
        except ValueError:
            return Response(
                {"error": "Date must use YYYY-MM-DD format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logs = DailyWorkLog.objects.filter(
            project=project,
            work_date=parsed_date,
        )

        attendance = LabourAttendance.objects.filter(
            work_log__in=logs,
        )

        present_count = attendance.filter(
            status=LabourAttendance.Status.PRESENT,
        ).count()

        half_day_count = attendance.filter(
            status=LabourAttendance.Status.HALF_DAY,
        ).count()

        absent_count = attendance.filter(
            status=LabourAttendance.Status.ABSENT,
        ).count()

        labour_cost = Decimal("0.00")

        for record in attendance.select_related(
            "worker",
            "work_log",
        ):
            if record.worker_id is None:
                # Historical attendance has no registered wage source.
                continue

            assignment = ProjectWorkerAssignment.objects.filter(
                project=project,
                worker_id=record.worker_id,
                start_date__lte=parsed_date,
            ).filter(
                Q(end_date__isnull=True)
                | Q(end_date__gte=parsed_date),
            ).order_by("-start_date").first()

            if assignment is None:
                continue

            if record.status == LabourAttendance.Status.PRESENT:
                labour_cost += assignment.agreed_daily_wage
            elif record.status == LabourAttendance.Status.HALF_DAY:
                labour_cost += assignment.agreed_daily_wage / Decimal("2")

        return Response({
            "project_id": project.pk,
            "work_date": parsed_date,
            "present_count": present_count,
            "half_day_count": half_day_count,
            "absent_count": absent_count,
            "total_recorded": attendance.count(),
            "labour_cost": labour_cost.quantize(Decimal("0.01")),
        })
