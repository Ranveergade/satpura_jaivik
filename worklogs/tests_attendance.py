
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from auditlog.models import AuditLog
from projects.models import Project
from worklogs.models import (
    DailyWorkLog,
    LabourAttendance,
    Worker,
    ProjectWorkerAssignment,
)

User = get_user_model()


class LabourAttendanceAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="attendance_admin",
            password="Test-Password-123!",
            role="ADMINISTRATOR",
        )
        self.supervisor = User.objects.create_user(
            username="attendance_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.other_supervisor = User.objects.create_user(
            username="attendance_other_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.farmer = User.objects.create_user(
            username="attendance_farmer",
            password="Test-Password-123!",
            role="FARMER",
        )

        self.project = self.create_project(
            self.farmer, self.supervisor, "Soybean"
        )
        self.other_project = self.create_project(
            self.farmer, self.other_supervisor, "Wheat"
        )

        self.work_log = self.create_work_log(
            self.project, self.supervisor, "Checked irrigation"
        )
        self.other_work_log = self.create_work_log(
            self.other_project, self.other_supervisor, "Inspected crops"
        )

        self.list_url = "/api/work-logs/attendance/"

    def create_worker(self, name="Ramesh Kumar", daily_wage="2500.00"):
        """Register a worker through the worker registry."""
        return Worker.objects.create(
            name=name.strip(),
            phone_number="9999999999",
            skill="Field",
            daily_wage=daily_wage,
            created_by=self.supervisor,
        )

    def create_assignment(self, worker, project, start_date=None):
        return ProjectWorkerAssignment.objects.create(
            project=project,
            worker=worker,
            assigned_by=self.supervisor,
            start_date=start_date or date(2026, 10, 25),
            end_date=None,
            agreed_daily_wage=worker.daily_wage,
        )

    def create_project(self, farmer, supervisor, crop_type):
        return Project.objects.create(
            farmer=farmer,
            supervisor=supervisor,
            land_details="Test farm",
            land_area="5.00",
            crop_type=crop_type,
            project_budget="50000.00",
            subsidy_amount="0.00",
            loan_amount="0.00",
            start_date=date(2026, 1, 1),
            estimated_completion_date=date(2026, 12, 31),
        )

    def create_work_log(self, project, supervisor, activities):
        return DailyWorkLog.objects.create(
            project=project,
            supervisor=supervisor,
            work_date=date(2026, 10, 25),
            activities=activities,
            laborers_present=2,
        )

    def payload(self, work_log_id=None, worker=None, status="PRESENT"):
        return {
            "work_log": work_log_id or self.work_log.pk,
            "worker": worker.pk if worker is not None else None,
            "status": status,
        }

    def register_assigned_worker(self, project=None, name="Ramesh Kumar"):
        worker = self.create_worker(name=name)
        self.create_assignment(worker, project or self.project)
        return worker

    def test_unauthenticated_user_cannot_list_attendance(self):
        response = self.client.get(self.list_url)
        self.assertEqual(
            response.status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_supervisor_can_record_attendance(self):
        worker = self.register_assigned_worker()
        self.client.force_authenticate(user=self.supervisor)
        response = self.client.post(
            self.list_url,
            self.payload(worker=worker),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )
        self.assertTrue(
            LabourAttendance.objects.filter(
                work_log=self.work_log,
                worker=worker,
                recorded_by=self.supervisor,
            ).exists()
        )

    def test_worker_name_is_trimmed(self):
        worker = self.register_assigned_worker(name="  Ramesh Kumar  ")
        self.client.force_authenticate(user=self.supervisor)
        response = self.client.post(
            self.list_url,
            self.payload(worker=worker),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["worker_name"], "Ramesh Kumar")

    def test_farmer_cannot_record_attendance(self):
        self.client.force_authenticate(user=self.farmer)
        response = self.client.post(
            self.list_url, self.payload(), format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )

    def test_supervisor_cannot_record_for_unassigned_project(self):
        other_worker = self.create_worker(
            name="Suresh Patel",
            daily_wage="2200.00",
        )
        self.create_assignment(
            other_worker,
            self.other_project,
            start_date=date(2026, 10, 25),
        )
        self.client.force_authenticate(user=self.supervisor)
        response = self.client.post(
            self.list_url,
            self.payload(self.other_work_log.pk, worker=other_worker),
            format="json",
        )

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )
        self.assertEqual(LabourAttendance.objects.count(), 0)

    def test_invalid_status_is_rejected(self):
        worker = self.register_assigned_worker()
        self.client.force_authenticate(user=self.supervisor)
        payload = self.payload(worker=worker)
        payload["status"] = "ON_VACATION"

        response = self.client.post(
            self.list_url, payload, format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_duplicate_attendance_is_rejected(self):
        worker = self.register_assigned_worker()
        LabourAttendance.objects.create(
            work_log=self.work_log,
            worker_name="Ramesh Kumar",
            status=LabourAttendance.Status.PRESENT,
            recorded_by=self.supervisor,
        )
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.post(
            self.list_url, self.payload(worker=worker), format="json"
        )

        self.assertEqual(
            response.status_code, status.HTTP_409_CONFLICT
        )
        self.assertEqual(LabourAttendance.objects.count(), 1)

    def test_supervisor_sees_only_assigned_attendance(self):
        LabourAttendance.objects.create(
            work_log=self.work_log,
            worker_name="Ramesh Kumar",
            status=LabourAttendance.Status.PRESENT,
            recorded_by=self.supervisor,
        )
        LabourAttendance.objects.create(
            work_log=self.other_work_log,
            worker_name="Suresh Patel",
            status=LabourAttendance.Status.ABSENT,
            recorded_by=self.other_supervisor,
        )
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["work_log"], self.work_log.pk
        )

    def test_admin_can_view_all_attendance(self):
        LabourAttendance.objects.create(
            work_log=self.work_log,
            worker_name="Ramesh Kumar",
            status=LabourAttendance.Status.PRESENT,
            recorded_by=self.supervisor,
        )
        LabourAttendance.objects.create(
            work_log=self.other_work_log,
            worker_name="Suresh Patel",
            status=LabourAttendance.Status.ABSENT,
            recorded_by=self.other_supervisor,
        )
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_attendance_creation_is_audited(self):
        worker = self.register_assigned_worker()
        self.client.force_authenticate(user=self.supervisor)
        response = self.client.post(
            self.list_url, self.payload(worker=worker), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            AuditLog.objects.filter(
                action=AuditLog.Action.LABOUR_ATTENDANCE_CREATED,
                user=self.supervisor,
                entity_type="LabourAttendance",
                record_id=str(response.data["id"]),
            ).exists()
        )

    def test_supervisor_cannot_view_other_supervisors_record(self):
        record = LabourAttendance.objects.create(
            work_log=self.other_work_log,
            worker_name="Suresh Patel",
            status=LabourAttendance.Status.PRESENT,
            recorded_by=self.other_supervisor,
        )
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get(f"{self.list_url}{record.pk}/")

        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )
