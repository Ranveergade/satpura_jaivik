from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Expense, ExpenseStatus
from .serializers import ExpenseSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by("-created_at")
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        expense = self.get_object()
        new_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if new_status in ExpenseStatus.values:
            expense.status = new_status
            if notes:
                expense.verification_notes = notes
            expense.save()
            return Response(ExpenseSerializer(expense).data)
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
