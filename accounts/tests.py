
from datetime import timedelta
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from .models import EmailOTP


User = get_user_model()


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="auth_test_farmer",
            email="auth_test@example.com",
            password="Test-Password-123!",
            role="FARMER",
            is_active=True,
        )

        self.login_url = "/api/accounts/login/"
        self.verify_url = "/api/accounts/verify-otp/"

    def login_with_password(self):
        """Create a login challenge using a predictable test OTP."""
        with (
            patch("accounts.views.send_mail") as mocked_send_mail,
            patch.object(
                EmailOTP,
                "generate_code",
                return_value="123456",
            ),
        ):
            response = self.client.post(
                self.login_url,
                {
                    "username": self.user.username,
                    "password": "Test-Password-123!",
                },
                format="json",
            )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            msg=f"Login failed: {response.json()}",
        )

        self.assertIn("challenge_id", response.json())

        challenge_id = response.json()["challenge_id"]
        challenge = EmailOTP.objects.get(pk=challenge_id)

        # Confirm that the generated test OTP matches the stored hash.
        self.assertTrue(
            challenge.verify_code("123456"),
            msg="The stored OTP hash does not match the test OTP.",
        )

        mocked_send_mail.assert_called_once()

        return challenge_id

    def verify_otp(self, challenge_id, otp):
        """Submit an OTP to the verification endpoint."""
        return self.client.post(
            self.verify_url,
            {
                "challenge_id": challenge_id,
                "otp": otp,
            },
            format="json",
        )

    def test_invalid_password_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": self.user.username,
                "password": "Wrong-Password!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_unknown_username_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "unknown_user",
                "password": "Test-Password-123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_valid_password_creates_otp_challenge(self):
        challenge_id = self.login_with_password()

        self.assertTrue(
            EmailOTP.objects.filter(
                pk=challenge_id,
                user=self.user,
                is_used=False,
            ).exists()
        )

    def test_incorrect_otp_is_rejected_and_attempt_count_increases(self):
        challenge_id = self.login_with_password()

        response = self.verify_otp(challenge_id, "999999")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        challenge = EmailOTP.objects.get(pk=challenge_id)
        self.assertEqual(challenge.attempts, 1)

    def test_expired_otp_is_rejected(self):
        challenge_id = self.login_with_password()

        challenge = EmailOTP.objects.get(pk=challenge_id)
        challenge.expires_at = timezone.now() - timedelta(minutes=1)
        challenge.save(update_fields=["expires_at"])

        response = self.verify_otp(challenge_id, "123456")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_used_otp_cannot_be_reused(self):
        challenge_id = self.login_with_password()

        first_response = self.verify_otp(challenge_id, "123456")

        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
            msg=f"First OTP verification failed: {first_response.json()}",
        )

        second_response = self.verify_otp(challenge_id, "123456")

        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_five_incorrect_attempts_invalidate_otp(self):
        challenge_id = self.login_with_password()

        for _ in range(5):
            response = self.verify_otp(challenge_id, "999999")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        challenge = EmailOTP.objects.get(pk=challenge_id)

        self.assertEqual(challenge.attempts, 5)
        self.assertTrue(challenge.is_used)

        retry_response = self.verify_otp(challenge_id, "123456")

        self.assertEqual(
            retry_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_successful_otp_returns_jwt_tokens(self):
        challenge_id = self.login_with_password()

        response = self.verify_otp(challenge_id, "123456")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            msg=f"OTP verification failed: {response.json()}",
        )

        data = response.json()

        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertEqual(data["username"], self.user.username)
        self.assertEqual(data["role"], "FARMER")

    def test_malformed_otp_is_rejected(self):
        challenge_id = self.login_with_password()

        for invalid_otp in ("123", "abcdef", "１２３４５６", ""):
            with self.subTest(otp=invalid_otp):
                response = self.verify_otp(
                    challenge_id,
                    invalid_otp,
                )

                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST,
                    msg=(
                        "Unexpected result for malformed OTP: "
                        f"{invalid_otp!r}"
                    ),
                )

    def test_nonexistent_challenge_is_rejected(self):
        response = self.verify_otp(999999, "123456")

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
