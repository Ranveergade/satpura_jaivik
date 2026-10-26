
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from auditlog.models import AuditLog
from projects.models import Project
from .models import Expense

User = get_user_model()


class ExpenseAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="expense_admin",
            password="Test-Password-123!",
            role="ADMINISTRATOR",
        )
        self.accounts = User.objects.create_user(
            username="expense_accounts",
            password="Test-Password-123!",
            role="ACCOUNTS",
        )
        self.supervisor = User.objects.create_user(
            username="expense_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.other_supervisor = User.objects.create_user(
            username="expense_other_supervisor",
            password="Test-Password-123!",
            role="SUPERVISOR",
        )
        self.farmer = User.objects.create_user(
            username="expense_farmer",
            password="Test-Password-123!",
            role="FARMER",
        )

        self.project = self.create_project(
            self.farmer, self.supervisor, "Soybean"
        )
        self.other_project = self.create_project(
            self.farmer, self.other_supervisor, "Wheat"
        )

        self.list_url = "/api/expenses/"

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

    def payload(self, project_id=None):
        return {
            "project": project_id or self.project.pk,
            "amount": "1250.50",
            "category": "MATERIALS",
            "description": "Purchased irrigation materials",
            "expense_date": date.today().isoformat(),
        }

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def create_expense(self, submitted_by=None, project=None):
        return Expense.objects.create(
            project=project or self.project,
            submitted_by=submitted_by or self.supervisor,
            amount="1250.50",
            category="MATERIALS",
            description="Irrigation materials",
            expense_date=date.today(),
        )

    def test_supervisor_can_submit_expense(self):
        self.authenticate(self.supervisor)

        response = self.client.post(
            self.list_url, self.payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "PENDING")
        self.assertEqual(
            Expense.objects.get().submitted_by, self.supervisor
        )

    def test_supervisor_cannot_submit_for_unassigned_project(self):
        self.authenticate(self.supervisor)

        response = self.client.post(
            self.list_url,
            self.payload(self.other_project.pk),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Expense.objects.count(), 0)

    def test_farmer_cannot_submit_expense(self):
        self.authenticate(self.farmer)

        response = self.client.post(
            self.list_url, self.payload(), format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_cannot_set_approved_status(self):
        self.authenticate(self.supervisor)
        payload = self.payload()
        payload["status"] = "APPROVED"

        response = self.client.post(
            self.list_url, payload, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expense.objects.get().status, "PENDING")

    def test_negative_amount_is_rejected(self):
        self.authenticate(self.supervisor)
        payload = self.payload()
        payload["amount"] = "-100"

        response = self.client.post(
            self.list_url, payload, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_supervisor_sees_only_assigned_project_expenses(self):
        self.create_expense(project=self.project)
        self.create_expense(
            submitted_by=self.other_supervisor,
            project=self.other_project,
        )
        self.authenticate(self.supervisor)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_accounts_can_view_all_expenses(self):
        self.create_expense(project=self.project)
        self.create_expense(
            submitted_by=self.other_supervisor,
            project=self.other_project,
        )
        self.authenticate(self.accounts)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_accounts_can_approve_expense(self):
        expense = self.create_expense()
        self.authenticate(self.accounts)

        response = self.client.post(
            f"{self.list_url}{expense.pk}/review/",
            {"decision": "APPROVED", "review_note": "Verified receipt"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expense.refresh_from_db()
        self.assertEqual(expense.status, "APPROVED")
        self.assertEqual(expense.reviewed_by, self.accounts)

    def test_rejection_requires_a_reason(self):
        expense = self.create_expense()
        self.authenticate(self.accounts)

        response = self.client.post(
            f"{self.list_url}{expense.pk}/review/",
            {"decision": "REJECTED", "review_note": ""},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        expense.refresh_from_db()
        self.assertEqual(expense.status, "PENDING")

    def test_submitter_cannot_approve_own_expense(self):
        expense = self.create_expense(submitted_by=self.accounts)
        self.authenticate(self.accounts)

        response = self.client.post(
            f"{self.list_url}{expense.pk}/review/",
            {"decision": "APPROVED", "review_note": "Self approval"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        expense.refresh_from_db()
        self.assertEqual(expense.status, "PENDING")

    def test_review_is_audited(self):
        expense = self.create_expense()
        self.authenticate(self.accounts)

        response = self.client.post(
            f"{self.list_url}{expense.pk}/review/",
            {"decision": "APPROVED", "review_note": "Verified"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            AuditLog.objects.filter(
                action="EXPENSE_REVIEWED",
                record_id=str(expense.pk),
            ).exists()
        )
