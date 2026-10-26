
from datetime import date

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

from .models import Expense
from .serializers import ExpenseSerializer


ADMIN_ROLES = {"SUPER_ADMINISTRATOR", "ADMINISTRATOR"}
REVIEW_ROLES = ADMIN_ROLES | {"ACCOUNTS"}


def visible_expenses(user):
    expenses = Expense.objects.select_related(
        "project",
        "submitted_by",
        "reviewed_by",
    )

    if user.role in ADMIN_ROLES | {"ACCOUNTS", "MANAGEMENT"}:
        return expenses

    if user.role == "SUPERVISOR":
        return expenses.filter(project__supervisor=user)

    if user.role == "FARMER":
        return expenses.filter(project__farmer=user)

    return expenses.none()


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def expense_list_create(request):
    if request.method == "GET":
        expenses = visible_expenses(request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    if request.user.role not in ADMIN_ROLES | {"SUPERVISOR"}:
        return Response(
            {"error": "You are not authorized to submit expenses."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ExpenseSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    project = serializer.validated_data["project"]

    if (
        request.user.role == "SUPERVISOR"
        and project.supervisor_id != request.user.pk
    ):
        return Response(
            {"error": "You can only submit expenses for your assigned projects."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.user.role in ADMIN_ROLES:
        pass

    expense = serializer.save(
        submitted_by=request.user,
        status=Expense.Status.PENDING,
    )

    record_audit(
        action=AuditLog.Action.EXPENSE_CREATED,
        user=request.user,
        request=request,
        entity_type="Expense",
        record_id=expense.pk,
        changes={
            "project_id": expense.project_id,
            "amount": str(expense.amount),
            "category": expense.category,
            "status": expense.status,
        },
    )

    return Response(
        ExpenseSerializer(expense).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def expense_review(request, expense_id):
    if request.user.role not in REVIEW_ROLES:
        return Response(
            {"error": "You are not authorized to review expenses."},
            status=status.HTTP_403_FORBIDDEN,
        )

    expense = Expense.objects.filter(pk=expense_id).first()

    if expense is None:
        return Response(
            {"error": "Expense not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if expense.submitted_by_id == request.user.pk:
        return Response(
            {"error": "You cannot review your own expense."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if expense.status != Expense.Status.PENDING:
        return Response(
            {"error": "Only pending expenses can be reviewed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    decision = request.data.get("decision")
    review_note = request.data.get("review_note", "")

    if decision not in {
        Expense.Status.APPROVED,
        Expense.Status.REJECTED,
    }:
        return Response(
            {"error": "Decision must be APPROVED or REJECTED."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not isinstance(review_note, str):
        return Response(
            {"error": "Review note must be text."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    review_note = review_note.strip()

    if decision == Expense.Status.REJECTED and not review_note:
        return Response(
            {"error": "A reason is required when rejecting an expense."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    old_status = expense.status
    expense.status = decision
    expense.reviewed_by = request.user
    expense.review_note = review_note
    expense.save(
        update_fields=[
            "status",
            "reviewed_by",
            "review_note",
            "updated_at",
        ]
    )

    record_audit(
        action=AuditLog.Action.EXPENSE_REVIEWED,
        user=request.user,
        request=request,
        entity_type="Expense",
        record_id=expense.pk,
        changes={
            "old_status": old_status,
            "new_status": expense.status,
            "review_note": expense.review_note,
        },
    )

    return Response(ExpenseSerializer(expense).data)
