
from rest_framework import serializers
from .models import FarmerProfile


class FarmerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = FarmerProfile
        fields = [
            "id",
            "user",
            "username",
            "email",
            "phone_number",
            "address",
            "village",
            "date_of_birth",
            "emergency_contact",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_phone_number(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Phone number cannot be empty."
            )
        return value

    def validate_address(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Address cannot be empty."
            )
        return value

    def validate_village(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Village cannot be empty."
            )
        return value
