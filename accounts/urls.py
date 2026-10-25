
from django.urls import path

from .views import api_login, csrf_token_view, verify_otp,api_logout

urlpatterns = [
    path("login/", api_login, name="api-login"),
    path("verify-otp/", verify_otp, name="verify-otp"),
    path("csrf/", csrf_token_view, name="csrf-token"),
    path("logout/", api_logout, name="api-logout"),
]
