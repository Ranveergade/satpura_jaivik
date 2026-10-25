
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from .models import AuditLog


ALLOWED_ROLES = {
    "SUPER_ADMINISTRATOR",
    "ADMINISTRATOR",
}


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def audit_log_list(request):
    if request.user.role not in ALLOWED_ROLES:
        return Response(
            {"error": "You are not authorized to view audit logs."},
            status=status.HTTP_403_FORBIDDEN,
        )

    logs = AuditLog.objects.select_related("user").order_by("-timestamp")

    paginator = Paginator(logs, 20)

    try:
        page = paginator.page(request.query_params.get("page", 1))
    except (PageNotAnInteger, EmptyPage):
        return Response(
            {"error": "Invalid page number."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    results = [
        {
            "id": log.pk,
            "user_id": log.user_id,
            "username": log.user.username if log.user else None,
            "action": log.action,
            "entity_type": log.entity_type,
            "record_id": log.record_id,
            "timestamp": log.timestamp.isoformat(),
            "ip_address": log.ip_address,
            "user_agent": log.user_agent,
            "changes": log.changes,
        }
        for log in page.object_list
    ]

    return Response(
        {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page.number,
            "results": results,
        }
    )
