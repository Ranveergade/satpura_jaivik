
from django.urls import path

from .views import api_login, csrf_token_view, verify_otp,api_logout,FarmerProfileListCreateView,FarmerProfileDetailView

urlpatterns = [
    path("login/", api_login, name="api-login"),
    path("verify-otp/", verify_otp, name="verify-otp"),
    path("csrf/", csrf_token_view, name="csrf-token"),
    path("logout/", api_logout, name="api-logout"),
    path(
    "farmer-profiles/",
    FarmerProfileListCreateView.as_view(),
    name="farmer-profile-list-create",
                ),
    path(
    "farmer-profiles/<int:pk>/",
    FarmerProfileDetailView.as_view(),
    name="farmer-profile-detail",
            ),
]
