from django.db import models
from django.contrib.auth.models import AbstractUser
import hashlib

from django.conf import settings
from django.db import models
from django.utils import timezone



class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMINISTRATOR = "SUPER_ADMINISTRATOR", "Super Administrator"
        ADMINISTRATOR = "ADMINISTRATOR", "Administrator"
        ACCOUNTS = "ACCOUNTS", "Accounts Department"
        SUPERVISOR = "SUPERVISOR", "Supervisor"
        FARMER = "FARMER", "Farmer/Customer"
        MANAGEMENT = "MANAGEMENT", "Management"

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
    )

class EmailOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_otps",
    )
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"Email OTP for user {self.user_id}"

    
    @classmethod
    def generate_code(cls):
        import secrets
        return f"{secrets.randbelow(1_000_000):06d}"

    
    def set_code(self, code):
        import hashlib
        import hmac
        from django.conf import settings

        self.code_hash = hmac.new(
            settings.SECRET_KEY.encode(),
            code.encode(),
            hashlib.sha256,
        ).hexdigest()

    def verify_code(self, code):
        import hashlib
        import hmac
        from django.conf import settings

        submitted_hash = hmac.new(
            settings.SECRET_KEY.encode(),
            code.encode(),
            hashlib.sha256,
        ).hexdigest()

        return hmac.compare_digest(self.code_hash, submitted_hash)


