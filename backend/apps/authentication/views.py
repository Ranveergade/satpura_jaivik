from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.users.models import User
from apps.users.serializers import UserSerializer

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email_or_phone = request.data.get("email") or request.data.get("phone_number") or request.data.get("username")
        password = request.data.get("password")

        user = None
        if email_or_phone:
            user = User.objects.filter(email__iexact=email_or_phone).first() or User.objects.filter(phone_number=email_or_phone).first()

        if user:
            return Response({
                "token": f"token-{user.id}",
                "user": UserSerializer(user).data
            })

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class OTPLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone_number")
        user = User.objects.filter(phone_number=phone).first() if phone else None
        if not user:
            user = User.objects.filter(role="FARMER").first()

        return Response({
            "token": f"otp-token-{user.id if user else 'demo'}",
            "user": UserSerializer(user).data if user else None
        })
