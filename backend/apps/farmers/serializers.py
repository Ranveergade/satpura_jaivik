from rest_framework import serializers
from .models import FarmerProfile
from apps.users.serializers import UserSerializer

class FarmerProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)

    class Meta:
        model = FarmerProfile
        fields = "__all__"
