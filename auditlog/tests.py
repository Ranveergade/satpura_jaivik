
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from .models import AuditLog


User = get_user_model()


class AuditLogAPITests(APITestCase):
    def setUp(self):
        self.url = reverse("audit-log-list")

        self.admin = User.objects.create_user(
            username="audit_admin",
            password="test-password-only",
            role="ADMINISTRATOR",
        )

        self.super_admin = User.objects.create_user(
            username="audit_root",
            password="test-password-only",
            role="SUPER_ADMINISTRATOR",
        )

        self.farmer = User.objects.create_user(
            username="audit_farmer",
            password="test-password-only",
            role="FARMER",
        )

        self.log = AuditLog.objects.create(
            user=self.admin,
            action=AuditLog.Action.LOGIN_SUCCESS,
            entity_type="User",
            record_id=str(self.admin.pk),
            changes={"test": True},
        )

    def test_unauthenticated_request_returns_401(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_farmer_is_denied_access(self):
        self.client.force_authenticate(user=self.farmer)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(
            response.data["error"],
            "You are not authorized to view audit logs.",
        )

    def test_administrator_can_view_audit_logs(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("total_pages", response.data)
        self.assertIn("current_page", response.data)
        self.assertIn("results", response.data)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["action"], "LOGIN_SUCCESS")

    def test_super_administrator_can_view_audit_logs(self):
        self.client.force_authenticate(user=self.super_admin)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_is_not_allowed(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.post(self.url, {"action": "LOGIN_SUCCESS"})

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_patch_is_not_allowed(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.patch(self.url, {"action": "LOGOUT"})

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_delete_is_not_allowed(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.delete(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def test_invalid_page_number_returns_400(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.url, {"page": "invalid"})

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(response.data["error"], "Invalid page number.")

    def test_pagination_returns_twenty_records_per_page(self):
        for i in range(24):
            AuditLog.objects.create(
                user=self.admin,
                action=AuditLog.Action.LOGIN_SUCCESS,
                entity_type="User",
                record_id=str(i),
                changes={},
            )

        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 25)
        self.assertEqual(response.data["total_pages"], 2)
        self.assertEqual(response.data["current_page"], 1)
        self.assertEqual(len(response.data["results"]), 20)

    def test_second_page_returns_remaining_records(self):
        for i in range(24):
            AuditLog.objects.create(
                user=self.admin,
                action=AuditLog.Action.LOGIN_SUCCESS,
                entity_type="User",
                record_id=str(i),
                changes={},
            )

        self.client.force_authenticate(user=self.admin)

        response = self.client.get(self.url, {"page": 2})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["current_page"], 2)
        self.assertEqual(len(response.data["results"]), 5)
