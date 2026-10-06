from rest_framework import serializers
from .models import FarmProject
from apps.users.serializers import UserSerializer

class FarmProjectSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source="farmer.full_name")
    supervisor_name = serializers.ReadOnlyField(source="supervisor.full_name")

    class Meta:
        model = FarmProject
        fields = "__all__"
