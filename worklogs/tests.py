
from datetime import date

from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from auditlog.models import AuditLog
from projects.models import Project
from .models import DailyWorkLog


User = get_user_model()


class DailyWorkLogAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="worklog_admin",
            password="Test-Password-123!",
            role="ADMINISTRATOR",
        )
        self.supervisor = User.objects.create_user(
            username="worklog_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.other_supervisor = User.objects.create_user(
            username="other_worklog_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.farmer = User.objects.create_user(
            username="worklog_farmer",
            password="Test-Password-123!",
            role="FARMER",
        )

        self.project = self.create_project(
            farmer=self.farmer,
            supervisor=self.supervisor,
            crop_type="Soybean",
        )
        self.other_project = self.create_project(
            farmer=self.farmer,
            supervisor=self.other_supervisor,
            crop_type="Wheat",
        )

        self.list_url = "/api/work-logs/"

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

    def valid_payload(self, project_id):
        return {
            "project": project_id,
            "work_date": "2026-10-25",
            "activities": "Prepared soil and inspected irrigation.",
            "laborers_present": 4,
            "observations": "Irrigation system operating normally.",
            "check_in_latitude": "22.719600",
            "check_in_longitude": "75.857700",
        }

    def test_unauthenticated_user_cannot_access_work_logs(self):
        response = self.client.get(self.list_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_supervisor_can_create_log_for_assigned_project(self):
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.post(
            self.list_url,
            self.valid_payload(self.project.pk),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )

        log = DailyWorkLog.objects.get(pk=response.data["id"])
        self.assertEqual(log.supervisor, self.supervisor)
        self.assertEqual(log.project, self.project)

    def test_supervisor_cannot_log_work_for_unassigned_project(self):
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.post(
            self.list_url,
            self.valid_payload(self.other_project.pk),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(DailyWorkLog.objects.count(), 0)

    def test_farmer_cannot_create_work_log(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.post(
            self.list_url,
            self.valid_payload(self.project.pk),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_supervisor_only_sees_logs_for_assigned_projects(self):
        DailyWorkLog.objects.create(
            project=self.project,
            supervisor=self.supervisor,
            work_date=date(2026, 10, 25),
            activities="Supervisor's own log",
            laborers_present=3,
        )
        DailyWorkLog.objects.create(
            project=self.other_project,
            supervisor=self.other_supervisor,
            work_date=date(2026, 10, 25),
            activities="Another supervisor's log",
            laborers_present=2,
        )

        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["project"],
            self.project.pk,
        )

    def test_admin_can_view_all_work_logs(self):
        DailyWorkLog.objects.create(
            project=self.project,
            supervisor=self.supervisor,
            work_date=date(2026, 10, 25),
            activities="First log",
            laborers_present=3,
        )
        DailyWorkLog.objects.create(
            project=self.other_project,
            supervisor=self.other_supervisor,
            work_date=date(2026, 10, 25),
            activities="Second log",
            laborers_present=2,
        )

        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_work_log_creation_writes_audit_event(self):
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.post(
            self.list_url,
            self.valid_payload(self.project.pk),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            msg=str(response.data),
        )

        self.assertTrue(
            AuditLog.objects.filter(
                action=AuditLog.Action.WORK_LOG_CREATED,
                user=self.supervisor,
                entity_type="DailyWorkLog",
                record_id=str(response.data["id"]),
            ).exists()
        )

    def test_invalid_gps_coordinates_are_rejected(self):
        self.client.force_authenticate(user=self.supervisor)

        payload = self.valid_payload(self.project.pk)
        payload["check_in_latitude"] = "100.000000"

        response = self.client.post(
            self.list_url,
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(DailyWorkLog.objects.count(), 0)

    def test_detail_endpoint_returns_assigned_log(self):
        log = DailyWorkLog.objects.create(
            project=self.project,
            supervisor=self.supervisor,
            work_date=date(2026, 10, 25),
            activities="Checked crop growth",
            laborers_present=2,
        )

        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get(
            f"{self.list_url}{log.pk}/"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], log.pk)

    def test_supervisor_cannot_view_another_supervisors_log(self):
        log = DailyWorkLog.objects.create(
            project=self.other_project,
            supervisor=self.other_supervisor,
            work_date=date(2026, 10, 25),
            activities="Private project log",
            laborers_present=2,
        )

        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get(
            f"{self.list_url}{log.pk}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )
