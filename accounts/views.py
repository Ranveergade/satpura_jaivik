
import json
from datetime import timedelta

from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework import generics

from .models import EmailOTP
from auditlog.models import AuditLog
from auditlog.utils import record_audit
from .models import FarmerProfile
from .serializers import FarmerProfileSerializer
from .permissions import IsFarmerOrPrivilegedStaff

OTP_LIFETIME_MINUTES = 5
OTP_MAX_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60


class FarmerProfileListCreateView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [
        IsAuthenticated,
        IsFarmerOrPrivilegedStaff,
    ]
    serializer_class = FarmerProfileSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "FARMER":
            return FarmerProfile.objects.filter(user=user)

        return FarmerProfile.objects.filter(user__role="FARMER")

    def perform_create(self, serializer):
        user_id = self.request.data.get("user")

        if not user_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {"user": "A farmer account ID is required."}
            )

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            farmer = User.objects.get(
                pk=user_id,
                role="FARMER",
                is_active=True,
            )
        except (User.DoesNotExist, ValueError, TypeError):
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {"user": "Select a valid active farmer account."}
            )

        if (
            self.request.user.role == "FARMER"
            and farmer.pk != self.request.user.pk
        ):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "You can only create your own profile."
            )

        serializer.save(user=farmer)


class FarmerProfileDetailView(generics.RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [
        IsAuthenticated,
        IsFarmerOrPrivilegedStaff,
    ]
    serializer_class = FarmerProfileSerializer
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user

        if user.role == "FARMER":
            return FarmerProfile.objects.filter(user=user)

        return FarmerProfile.objects.filter(user__role="FARMER")

def read_json_body(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None

    return data if isinstance(data, dict) else None


@require_POST
def api_login(request):
    data = read_json_body(request)

    if data is None:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not isinstance(username, str) or not isinstance(password, str):
        return JsonResponse(
            {"error": "Username and password are required."},
            status=400,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None or not user.is_active:
        record_audit(
            action=AuditLog.Action.LOGIN_FAILED,
            user=user,
            request=request,
            entity_type="User",
            changes={"reason": "Invalid credentials or inactive account"},
        )

        return JsonResponse(
            {"error": "Invalid username or password."},
            status=401,
        )

    if not user.email:
        return JsonResponse(
            {"error": "This account has no registered email address."},
            status=400,
        )

    now = timezone.now()

    recent_otp = EmailOTP.objects.filter(
        user=user,
        created_at__gte=now - timedelta(
            seconds=OTP_RESEND_COOLDOWN_SECONDS
        ),
    ).exists()

    if recent_otp:
        return JsonResponse(
            {"error": "Please wait 60 seconds before requesting another OTP."},
            status=429,
        )

    # Invalidate earlier challenges before creating a new one.
    EmailOTP.objects.filter(user=user, is_used=False).update(is_used=True)

    code = EmailOTP.generate_code()

    challenge = EmailOTP.objects.create(
        user=user,
        code_hash="",
        expires_at=now + timedelta(minutes=OTP_LIFETIME_MINUTES),
    )
    challenge.set_code(code)
    challenge.save(update_fields=["code_hash"])

    try:
        send_mail(
            subject="Your Satpura Jaivik login OTP",
            message=(
                f"Your login OTP is {code}.\n\n"
                f"It expires in {OTP_LIFETIME_MINUTES} minutes. "
                "Do not share this code with anyone."
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        challenge.is_used = True
        challenge.save(update_fields=["is_used"])
        return JsonResponse(
            {"error": "Unable to send OTP. Please try again later."},
            status=503,
        )

    return JsonResponse({
        "message": "OTP sent to your registered email.",
        "challenge_id": challenge.pk,
        "expires_in_seconds": OTP_LIFETIME_MINUTES * 60,
    })


@require_POST
def verify_otp(request):
    data = read_json_body(request)

    if data is None:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    challenge_id = data.get("challenge_id")
    code = data.get("otp")

    if (
        not isinstance(challenge_id, int)
        or isinstance(challenge_id, bool)
        or not isinstance(code, str)
        or len(code) != 6
        or not code.isascii()
        or not code.isdigit()
    ):
        return JsonResponse(
            {"error": "A valid challenge_id and six-digit OTP are required."},
            status=400,
        )

    try:
        challenge = EmailOTP.objects.select_related("user").get(
            pk=challenge_id
        )
    except EmailOTP.DoesNotExist:
        return JsonResponse(
            {"error": "Invalid or expired OTP."},
            status=400,
        )

    if challenge.is_used or challenge.is_expired():
        return JsonResponse(
            {"error": "Invalid or expired OTP."},
            status=400,
        )

    if challenge.attempts >= OTP_MAX_ATTEMPTS:
        challenge.is_used = True
        challenge.save(update_fields=["is_used"])
        return JsonResponse(
            {"error": "Too many incorrect attempts. Request a new OTP."},
            status=429,
        )

    if not challenge.verify_code(code):
        challenge.attempts += 1

        if challenge.attempts >= OTP_MAX_ATTEMPTS:
            challenge.is_used = True

        challenge.save(update_fields=["attempts", "is_used"])
        record_audit(
            action=AuditLog.Action.OTP_FAILED,
            user=challenge.user,
            request=request,
            entity_type="EmailOTP",
            record_id=challenge.pk,
            changes={"reason": "Incorrect OTP"},
        )

        return JsonResponse(
            {"error": "Invalid or expired OTP."},
            status=400,
        )

    if not challenge.user.is_active:
        challenge.is_used = True
        challenge.save(update_fields=["is_used"])
        return JsonResponse(
            {"error": "This account is inactive."},
            status=403,
        )

    # Mark it used before issuing tokens so it cannot be reused.
    challenge.is_used = True
    challenge.save(update_fields=["is_used"])

    refresh = RefreshToken.for_user(challenge.user)

    record_audit(
        action=AuditLog.Action.OTP_VERIFIED,
        user=challenge.user,
        request=request,
        entity_type="EmailOTP",
        record_id=challenge.pk,
    )

    record_audit(
        action=AuditLog.Action.LOGIN_SUCCESS,
        user=challenge.user,
        request=request,
        entity_type="User",
        record_id=challenge.user.pk,
    )


    return JsonResponse({
        "message": "Login successful.",
        "username": challenge.user.username,
        "role": challenge.user.role,
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    })


@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({"message": "CSRF cookie set."})



@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def api_logout(request):
    data = read_json_body(request)

    if data is None:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    refresh_token = data.get("refresh")

    if not isinstance(refresh_token, str) or not refresh_token:
        return JsonResponse(
            {"error": "Refresh token is required."},
            status=400,
        )

    try:
        token = RefreshToken(refresh_token)

        # Only revoke a refresh token belonging to the authenticated user.
        if str(token["user_id"]) != str(request.user.pk):
            return JsonResponse(
                {"error": "Invalid refresh token."},
                status=400,
            )

        token.blacklist()

    except (TokenError, KeyError):
        return JsonResponse(
            {"error": "Invalid or revoked refresh token."},
            status=400,
        )

    record_audit(
        action=AuditLog.Action.LOGOUT,
        user=request.user,
        request=request,
        entity_type="User",
        record_id=request.user.pk,
    )

    return JsonResponse({"message": "Logout successful."})
