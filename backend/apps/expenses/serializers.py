from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.ReadOnlyField(source="submitted_by.full_name")
    project_code = serializers.ReadOnlyField(source="project.project_code")

    class Meta:
        model = Expense
        fields = "__all__"
