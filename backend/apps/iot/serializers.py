from rest_framework import serializers
from .models import IoTSensorDevice

class IoTSensorDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IoTSensorDevice
        fields = "__all__"
