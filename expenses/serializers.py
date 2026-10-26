
from rest_framework import serializers
from .models import Expense
from datetime import date


class ExpenseSerializer(serializers.ModelSerializer):
    submitted_by = serializers.StringRelatedField(read_only=True)
    reviewed_by = serializers.StringRelatedField(read_only=True)
    status = serializers.ChoiceField(
        choices=Expense.Status.choices,
        read_only=True,
    )

    class Meta:
        model = Expense
        fields = [
            "id",
            "project",
            "submitted_by",
            "amount",
            "category",
            "description",
            "expense_date",
            "status",
            "reviewed_by",
            "review_note",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "submitted_by",
            "status",
            "reviewed_by",
            "review_note",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Expense amount must be greater than zero."
            )
        return value

    def validate_description(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Expense description cannot be empty."
            )
        return value

    def validate_expense_date(self, value):
        

        if value > date.today():
            raise serializers.ValidationError(
                "Expense date cannot be in the future."
            )
        return value
