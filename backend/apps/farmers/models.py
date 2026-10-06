import uuid
from django.db import models
from django.conf import settings

class FarmerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="farmer_profile")
    village = models.CharField(max_length=150)
    district = models.CharField(max_length=150, default="Hoshangabad")
    land_acreage = models.DecimalField(max_digits=8, decimal_places=2, default=5.0)
    primary_crop = models.CharField(max_length=100, default="Organic Rice")
    kisan_id = models.CharField(max_length=50, unique=True)
    aadhar_last4 = models.CharField(max_length=4, default="1234")
    gps_lat = models.FloatField(null=True, blank=True)
    gps_lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.village} ({self.kisan_id})"
