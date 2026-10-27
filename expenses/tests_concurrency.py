
import threading
from datetime import date
from queue import Queue
from unittest import skipUnless

from django.contrib.auth import get_user_model
from django.db import (
    close_old_connections,
    connection,
    connections,
    transaction,
)
from django.test import TransactionTestCase
from rest_framework import status
from rest_framework.test import APIClient

from auditlog.models import AuditLog
from expenses.models import Expense
from projects.models import Project


User = get_user_model()


@skipUnless(
    connection.vendor == "postgresql",
    "This concurrency test requires PostgreSQL.",
)
class ExpenseReviewConcurrencyTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.admin = User.objects.create_user(
            username="concurrency_admin",
            password="test-password-not-for-production",
            role="ADMINISTRATOR",
        )
        self.accounts = User.objects.create_user(
            username="concurrency_accounts",
            password="test-password-not-for-production",
            role="ACCOUNTS",
        )
        self.farmer = User.objects.create_user(
            username="concurrency_farmer",
            password="test-password-not-for-production",
            role="FARMER",
        )
        self.supervisor = User.objects.create_user(
            username="concurrency_supervisor",
            password="test-password-not-for-production",
            role="SUPERVISOR",
        )

        self.project = Project.objects.create(
            farmer=self.farmer,
            supervisor=self.supervisor,
            land_details="Concurrency test farm",
            land_area="5.00",
            crop_type="Soybean",
            project_budget="50000.00",
            subsidy_amount="0.00",
            loan_amount="0.00",
            start_date=date(2026, 1, 1),
            estimated_completion_date=date(2026, 12, 31),
        )

        self.expense = Expense.objects.create(
            project=self.project,
            submitted_by=self.supervisor,
            amount="1250.50",
            category=Expense.Category.MATERIALS,
            description="Concurrency test expense",
            expense_date=date.today(),
        )

    def test_only_one_simultaneous_review_can_succeed(self):
        expense_id = self.expense.pk
        barrier = threading.Barrier(2)
        results = Queue()

        def submit_review(user_id, decision, note):
            close_old_connections()
            try:
                user = User.objects.get(pk=user_id)
                client = APIClient()
                client.force_authenticate(user=user)

                barrier.wait(timeout=10)

                response = client.post(
                    f"/api/expenses/{expense_id}/review/",
                    {"decision": decision, "review_note": note},
                    format="json",
                )
                results.put(("response", response.status_code))
            except Exception as exc:
                results.put(("error", repr(exc)))
            finally:
                connections["default"].close()

        threads = [
            threading.Thread(
                target=submit_review,
                args=(
                    self.admin.pk,
                    Expense.Status.APPROVED,
                    "Approved by admin",
                ),
            ),
            threading.Thread(
                target=submit_review,
                args=(
                    self.accounts.pk,
                    Expense.Status.REJECTED,
                    "Rejected by accounts",
                ),
            ),
        ]

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join(timeout=20)

        self.assertTrue(
            all(not thread.is_alive() for thread in threads),
            "A review thread did not finish in time.",
        )

        outcomes = [results.get_nowait() for _ in threads]

        errors = [item for item in outcomes if item[0] == "error"]
        self.assertEqual(errors, [], f"Worker errors: {errors}")

        response_codes = [item[1] for item in outcomes]
        self.assertEqual(
            response_codes.count(status.HTTP_200_OK),
            1,
            f"Unexpected response codes: {response_codes}",
        )
        self.assertEqual(
            response_codes.count(status.HTTP_400_BAD_REQUEST),
            1,
            f"Unexpected response codes: {response_codes}",
        )

        self.expense.refresh_from_db()
        self.assertIn(
            self.expense.status,
            {Expense.Status.APPROVED, Expense.Status.REJECTED},
        )
        self.assertIsNotNone(self.expense.reviewed_by)

        review_logs = AuditLog.objects.filter(
            action=AuditLog.Action.EXPENSE_REVIEWED,
            entity_type="Expense",
            record_id=str(expense_id),
        )
        self.assertEqual(review_logs.count(), 1)
