from rest_framework import serializers
from .models import CCTVCamera

class CCTVCameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCTVCamera
        fields = "__all__"
