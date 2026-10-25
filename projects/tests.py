
from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from projects.models import Project


User = get_user_model()


class ProjectPermissionTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.create_user(
            username="test_admin",
            password="TestPassword-Admin-123!",
            role="ADMINISTRATOR",
            email="admin@example.com",
        )

        cls.farmer = User.objects.create_user(
            username="test_farmer",
            password="TestPassword-Farmer-123!",
            role="FARMER",
            email="farmer@example.com",
        )

        cls.other_farmer = User.objects.create_user(
            username="other_farmer",
            password="TestPassword-Other-123!",
            role="FARMER",
            email="other@example.com",
        )

        cls.supervisor = User.objects.create_user(
            username="test_supervisor",
            password="TestPassword-Supervisor-123!",
            role="SUPERVISOR",
            email="supervisor@example.com",
        )

        cls.other_supervisor = User.objects.create_user(
            username="other_supervisor",
            password="TestPassword-Other-Supervisor-123!",
            role="SUPERVISOR",
            email="other_supervisor@example.com",
        )

        cls.farmer_project = Project.objects.create(
            farmer=cls.farmer,
            supervisor=cls.supervisor,
            land_details="Test farm",
            land_area=Decimal("2.00"),
            crop_type="Wheat",
            project_budget=Decimal("10000.00"),
            start_date=date(2026, 10, 25),
            estimated_completion_date=date(2027, 3, 25),
        )

        cls.other_project = Project.objects.create(
            farmer=cls.other_farmer,
            supervisor=cls.other_supervisor,
            land_details="Other test farm",
            land_area=Decimal("3.00"),
            crop_type="Soybean",
            project_budget=Decimal("15000.00"),
            start_date=date(2026, 10, 25),
            estimated_completion_date=date(2027, 4, 25),
        )

    def test_unauthenticated_user_cannot_list_projects(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_farmer_sees_only_own_projects(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {
                item["id"]
                for item in response.json()["projects"]
                    }
        self.assertEqual(returned_ids, {self.farmer_project.id})

    def test_farmer_cannot_view_another_farmers_project(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.get(
            f"/api/projects/{self.other_project.id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_farmer_cannot_create_project(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.post(
            "/api/projects/create/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_farmer_cannot_update_project(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.patch(
            f"/api/projects/{self.farmer_project.id}/update/",
            {"crop_type": "Unauthorized Change"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_supervisor_sees_only_assigned_projects(self):
        self.client.force_authenticate(user=self.supervisor)

        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {
                    item["id"]
                    for item in response.json()["projects"]
                            }
        self.assertEqual(returned_ids, {self.farmer_project.id})

    def test_admin_can_update_project(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.patch(
            f"/api/projects/{self.farmer_project.id}/update/",
            {"crop_type": "Updated Wheat"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.farmer_project.refresh_from_db()
        self.assertEqual(self.farmer_project.crop_type, "Updated Wheat")
