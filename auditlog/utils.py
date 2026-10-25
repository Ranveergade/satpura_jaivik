
from .models import AuditLog


def get_client_ip(request):
    """
    Get the client's IP address from the request.
    """
    if request is None:
        return None

    return request.META.get("REMOTE_ADDR")


def record_audit(
    action,
    user=None,
    request=None,
    entity_type="",
    record_id="",
    changes=None,
):
    """
    Save one activity record to the audit log.
    """
    ip_address = get_client_ip(request)

    user_agent = ""
    if request is not None:
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]

    return AuditLog.objects.create(
        user=user if getattr(user, "is_authenticated", False) else None,
        action=action,
        entity_type=entity_type,
        record_id=str(record_id) if record_id is not None else "",
        ip_address=ip_address,
        user_agent=user_agent,
        changes=changes or {},
    )
