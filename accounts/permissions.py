
from rest_framework.permissions import BasePermission


class IsProjectViewer(BasePermission):
    """
    Allows access to project records based on the user's role.

    Object-level access is enforced separately by filtering the
    project queryset to the user's permitted projects.
    """

    allowed_roles = {
        "SUPER_ADMINISTRATOR",
        "ADMINISTRATOR",
        "ACCOUNTS",
        "MANAGEMENT",
        "SUPERVISOR",
        "FARMER",
    }

    def has_permission(self, request, view):
        user = request.user
        return (
            user
            and user.is_authenticated
            and user.is_active
            and user.role in self.allowed_roles
        )


class CanManageProjects(BasePermission):
    """Only administrators can create or update projects."""

    allowed_roles = {
        "SUPER_ADMINISTRATOR",
        "ADMINISTRATOR",
    }

    def has_permission(self, request, view):
        user = request.user
        return (
            user
            and user.is_authenticated
            and user.is_active
            and user.role in self.allowed_roles
        )




class IsFarmerOrPrivilegedStaff(BasePermission):
    """
    Farmers can access their own profile.
    Privileged staff can manage farmer profiles.
    """

    staff_roles = {
        "SUPER_ADMINISTRATOR",
        "ADMINISTRATOR",
        "ACCOUNTS",
        "MANAGEMENT",
    }

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and (
                user.role == "FARMER"
                or user.role in self.staff_roles
            )
        )
