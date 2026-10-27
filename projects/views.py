import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from datetime import date
from decimal import Decimal, InvalidOperation

from django.db import IntegrityError, transaction

from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import Project
from accounts.permissions import IsProjectViewer, CanManageProjects

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from auditlog.models import AuditLog
from auditlog.utils import record_audit



@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def project_list(request):
       user = request.user

       if user.role in [
            "SUPER_ADMINISTRATOR",
            "ADMINISTRATOR",
            "ACCOUNTS",
            "MANAGEMENT",
                    ]:
        projects = Project.objects.all()

       elif user.role == "SUPERVISOR":
            projects = Project.objects.filter(supervisor=user)

       elif user.role == "FARMER":
            projects = Project.objects.filter(farmer=user)

       else:
            return JsonResponse(
                {"error": "You do not have permission to view projects."},
                status=403,
            )
       data = [
                {
                    "id": project.id,
                    "farmer": project.farmer.username,
                    "supervisor": project.supervisor.username,
                    "crop_type": project.crop_type,
                    "status": project.status,
                    "project_budget": str(project.project_budget),
                }
           for project in projects
        ]

       return JsonResponse({"projects": data})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, CanManageProjects])
def project_create(request):

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400,
        )

    if not isinstance(data, dict):
        return JsonResponse(
            {"error": "JSON body must be an object."},
            status=400,
        )

    required_fields = [
        "farmer_id",
        "supervisor_id",
        "land_details",
        "land_area",
        "crop_type",
        "project_budget",
        "start_date",
        "estimated_completion_date",
    ]

    missing_fields = [
        field for field in required_fields
        if field not in data
        or data[field] is None
        or data[field] == ""
    ]

    if missing_fields:
        return JsonResponse(
            {
                "error": "Required fields are missing.",
                "missing_fields": missing_fields,
            },
            status=400,
        )

    User = get_user_model()

    try:
        farmer_id = int(data["farmer_id"])
        supervisor_id = int(data["supervisor_id"])

        farmer = User.objects.get(
            pk=farmer_id,
            role="FARMER",
            is_active=True,
        )

        supervisor = User.objects.get(
            pk=supervisor_id,
            role="SUPERVISOR",
            is_active=True,
        )
    except (ValueError, TypeError):
        return JsonResponse(
            {"error": "Farmer and supervisor IDs must be valid integers."},
            status=400,
        )
    except User.DoesNotExist:
        return JsonResponse(
            {
                "error": (
                    "The selected farmer or supervisor does not exist "
                    "or has the wrong role."
                )
            },
            status=400,
        )

    try:
        land_area = Decimal(str(data["land_area"]))
        project_budget = Decimal(str(data["project_budget"]))
        subsidy_amount = Decimal(str(data.get("subsidy_amount", 0)))
        loan_amount = Decimal(str(data.get("loan_amount", 0)))

        for value in [
            land_area,
            project_budget,
            subsidy_amount,
            loan_amount,
        ]:
            if not value.is_finite():
                raise ValueError

        if land_area <= 0:
            raise ValueError

        if min(project_budget, subsidy_amount, loan_amount) < 0:
            raise ValueError

        if any(
            value.as_tuple().exponent < -2
            for value in [
                land_area,
                project_budget,
                subsidy_amount,
                loan_amount,
            ]
        ):
            raise ValueError

    except (InvalidOperation, ValueError, TypeError):
        return JsonResponse(
            {
                "error": (
                    "Enter valid numbers. Land area must be positive; "
                    "financial amounts cannot be negative; "
                    "values may have at most two decimal places."
                )
            },
            status=400,
        )

    try:
        start_date = date.fromisoformat(data["start_date"])
        completion_date = date.fromisoformat(
            data["estimated_completion_date"]
        )
    except (ValueError, TypeError):
        return JsonResponse(
            {
                "error": (
                    "Dates must use YYYY-MM-DD format."
                )
            },
            status=400,
        )

    if completion_date < start_date:
        return JsonResponse(
            {
                "error": (
                    "Estimated completion date cannot be before "
                    "the project start date."
                )
            },
            status=400,
        )

    land_details = data["land_details"]
    crop_type = data["crop_type"]

    if (
        not isinstance(land_details, str)
        or not land_details.strip()
        or not isinstance(crop_type, str)
        or not crop_type.strip()
        or len(crop_type) > 100
    ):
        return JsonResponse(
            {
                "error": (
                    "Land details and crop type must be valid, "
                    "non-empty strings."
                )
            },
            status=400,
        )

    optional_coordinates = {}

    for field in ["latitude", "longitude"]:
        value = data.get(field)

        if value is None or value == "":
            optional_coordinates[field] = None
            continue

        try:
            coordinate = Decimal(str(value))

            if not coordinate.is_finite():
                raise ValueError

            if coordinate.as_tuple().exponent < -6:
                raise ValueError

            lower, upper = (
                (-90, 90) if field == "latitude"
                else (-180, 180)
            )

            if not lower <= coordinate <= upper:
                raise ValueError

            optional_coordinates[field] = coordinate

        except (InvalidOperation, ValueError, TypeError):
            return JsonResponse(
                {
                    "error": (
                        f"{field} must be a valid coordinate "
                        "with at most six decimal places."
                    )
                },
                status=400,
            )

    
    try:
        with transaction.atomic():
            project = Project.objects.create(
                farmer=farmer,
                supervisor=supervisor,
                land_details=land_details.strip(),
                land_area=land_area,
                latitude=optional_coordinates["latitude"],
                longitude=optional_coordinates["longitude"],
                crop_type=crop_type.strip(),
                project_budget=project_budget,
                subsidy_amount=subsidy_amount,
                loan_amount=loan_amount,
                start_date=start_date,
                estimated_completion_date=completion_date,
            )

            record_audit(
                action=AuditLog.Action.PROJECT_CREATED,
                user=request.user,
                request=request,
                entity_type="Project",
                record_id=project.pk,
                changes={
                    "crop_type": project.crop_type,
                    "status": project.status,
                    "project_budget": str(project.project_budget),
                },
            )

    except (IntegrityError, ValueError):
        return JsonResponse(
            {"error": "Project could not be saved."},
            status=400,
        )


    return JsonResponse(
        {
            "message": "Project created successfully.",
            "project": {
                "id": project.id,
                "farmer": project.farmer.username,
                "supervisor": project.supervisor.username,
                "crop_type": project.crop_type,
                "status": project.status,
                "project_budget": str(project.project_budget),
            },
        },
        status=201,
    )



@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsProjectViewer])
def project_detail(request, project_id):
    user = request.user

    if user.role in [
        "SUPER_ADMINISTRATOR",
        "ADMINISTRATOR",
        "ACCOUNTS",
        "MANAGEMENT",
    ]:
        projects = Project.objects.all()

    elif user.role == "SUPERVISOR":
        projects = Project.objects.filter(supervisor=user)

    elif user.role == "FARMER":
        projects = Project.objects.filter(farmer=user)

    else:
        return JsonResponse(
            {"error": "You do not have permission to view projects."},
            status=403,
        )

    try:
        project = projects.get(pk=project_id)
    except Project.DoesNotExist:
        return JsonResponse(
            {"error": "Project not found."},
            status=404,
        )

    return JsonResponse({
        "project": {
            "id": project.id,
            "farmer": project.farmer.username,
            "supervisor": project.supervisor.username,
            "land_details": project.land_details,
            "land_area": str(project.land_area),
            "latitude": (
                str(project.latitude)
                if project.latitude is not None
                else None
            ),
            "longitude": (
                str(project.longitude)
                if project.longitude is not None
                else None
            ),
            "crop_type": project.crop_type,
            "project_budget": str(project.project_budget),
            "subsidy_amount": str(project.subsidy_amount),
            "loan_amount": str(project.loan_amount),
            "start_date": project.start_date.isoformat(),
            "estimated_completion_date": (
                project.estimated_completion_date.isoformat()
            ),
            "status": project.status,
            "created_at": project.created_at.isoformat(),
            "updated_at": project.updated_at.isoformat(),
        }
    })


def parse_decimal(value, field, minimum=None, maximum=None, decimal_places=2):
    if isinstance(value, bool):
        raise ValueError(f"{field} must be a number.")

    try:
        number = Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        raise ValueError(f"{field} must be a valid number.")

    if not number.is_finite():
        raise ValueError(f"{field} must be a finite number.")

    if number.as_tuple().exponent < -decimal_places:
        raise ValueError(
            f"{field} supports at most {decimal_places} decimal places."
        )

    if minimum is not None and number < minimum:
        raise ValueError(f"{field} must be at least {minimum}.")

    if maximum is not None and number > maximum:
        raise ValueError(f"{field} must be at most {maximum}.")

    return number


@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, CanManageProjects])
def project_update(request, project_id):

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if not isinstance(data, dict) or not data:
        return JsonResponse(
            {"error": "Provide a non-empty JSON object."},
            status=400,
        )

    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Project not found."}, status=404)

    old_values = {
    field: getattr(project, field)
    for field in [
        "land_details",
        "land_area",
        "latitude",
        "longitude",
        "crop_type",
        "project_budget",
        "subsidy_amount",
        "loan_amount",
        "start_date",
        "estimated_completion_date",
        "status",
        ]
        }

    allowed_fields = {
        "land_details",
        "land_area",
        "latitude",
        "longitude",
        "crop_type",
        "project_budget",
        "subsidy_amount",
        "loan_amount",
        "start_date",
        "estimated_completion_date",
        "status",
    }

    unknown_fields = set(data) - allowed_fields

    if unknown_fields:
        return JsonResponse(
            {
                "error": "Unsupported fields.",
                "fields": sorted(unknown_fields),
            },
            status=400,
        )

    try:
        for field in ["land_details", "crop_type"]:
            if field in data:
                value = data[field]

                if not isinstance(value, str) or not value.strip():
                    raise ValueError(f"{field} must be a non-empty string.")

                if field == "crop_type" and len(value.strip()) > 100:
                    raise ValueError("crop_type cannot exceed 100 characters.")

                setattr(project, field, value.strip())

        if "land_area" in data:
            project.land_area = parse_decimal(
                data["land_area"], "land_area", minimum=Decimal("0.01")
            )

        for field, lower, upper in [
            ("latitude", Decimal("-90"), Decimal("90")),
            ("longitude", Decimal("-180"), Decimal("180")),
        ]:
            if field in data:
                value = data[field]

                if value is None or value == "":
                    setattr(project, field, None)
                else:
                    setattr(
                        project,
                        field,
                        parse_decimal(
                            value, field, minimum=lower, maximum=upper,
                            decimal_places=6,
                        ),
                    )

        for field in ["project_budget", "subsidy_amount", "loan_amount"]:
            if field in data:
                minimum = Decimal("0") if field != "project_budget" else Decimal("0.01")
                setattr(
                    project,
                    field,
                    parse_decimal(data[field], field, minimum=minimum),
                )

        for field in ["start_date", "estimated_completion_date"]:
            if field in data:
                value = data[field]

                if not isinstance(value, str):
                    raise ValueError(f"{field} must use YYYY-MM-DD format.")

                setattr(project, field, date.fromisoformat(value))

        if "status" in data:
            valid_statuses = Project.Status.values

            if data["status"] not in valid_statuses:
                raise ValueError(
                    f"status must be one of: {', '.join(valid_statuses)}."
                )

            project.status = data["status"]

        if project.estimated_completion_date < project.start_date:
            raise ValueError(
                "Estimated completion date cannot be before the start date."
            )

        

        
        with transaction.atomic():
            project.full_clean()
            project.save()

            changes = {}

            for field, old_value in old_values.items():
                new_value = getattr(project, field)

                old_value = (
                    str(old_value) if old_value is not None else None
                )
                new_value = (
                    str(new_value) if new_value is not None else None
                )

                if old_value != new_value:
                    changes[field] = {
                        "old": old_value,
                        "new": new_value,
                    }

            if changes:
                record_audit(
                    action=AuditLog.Action.PROJECT_UPDATED,
                    user=request.user,
                    request=request,
                    entity_type="Project",
                    record_id=project.pk,
                    changes=changes,
                )


    except (ValueError, TypeError, InvalidOperation) as error:
        return JsonResponse({"error": str(error)}, status=400)
    
    changes = {}

    for field, old_value in old_values.items():
        new_value = getattr(project, field)

        # Convert Decimal and date values into JSON-safe strings.
        old_value = str(old_value) if old_value is not None else None
        new_value = str(new_value) if new_value is not None else None

        if old_value != new_value:
            changes[field] = {
                "old": old_value,
                "new": new_value,
            }

    if changes:
        record_audit(
            action=AuditLog.Action.PROJECT_UPDATED,
            user=request.user,
            request=request,
            entity_type="Project",
            record_id=project.pk,
            changes=changes,
        )


    return JsonResponse({
        "message": "Project updated successfully.",
        "project": {
            "id": project.id,
            "farmer": project.farmer.username,
            "supervisor": project.supervisor.username,
            "crop_type": project.crop_type,
            "status": project.status,
            "project_budget": str(project.project_budget),
        },
    })

