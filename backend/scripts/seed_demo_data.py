import os
import sys
import django
from datetime import date
from django.core.management import call_command

# Add project root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.models import User, UserRole
from apps.farmers.models import FarmerProfile
from apps.projects.models import FarmProject, ProjectStatus
from apps.expenses.models import Expense, ExpenseCategory, ExpenseStatus
from apps.work_logs.models import DailyWorkLog
from apps.media.models import ProjectMediaDocument, MediaType
from apps.cctv.models import CCTVCamera
from apps.iot.models import IoTSensorDevice
from apps.chat.models import ChatMessage
from apps.notifications.models import Notification
from apps.audit.models import AuditLog

def seed():
    print("[MIGRATION] Running Django Database Migrations...")
    try:
        call_command("makemigrations")
        call_command("migrate")
        print("[SUCCESS] Migrations applied successfully.")
    except Exception as e:
        print(f"[NOTE] Migration note: {e}")

    print("[SEED] Seeding Satpura Jaivik FPO Database...")

    # 1. Create Users for all 6 Roles
    users_data = [
        {"email": "superadmin@satpurajaivik.org", "first_name": "Vikramaditya", "last_name": "Singh", "phone_number": "+91 98765 00001", "role": UserRole.SUPER_ADMIN},
        {"email": "admin@satpurajaivik.org", "first_name": "Ananya", "last_name": "Sharma", "phone_number": "+91 98765 00002", "role": UserRole.ADMINISTRATOR},
        {"email": "accounts@satpurajaivik.org", "first_name": "Rajesh", "last_name": "Verma", "phone_number": "+91 98765 00003", "role": UserRole.ACCOUNTS},
        {"email": "supervisor@satpurajaivik.org", "first_name": "Sunil", "last_name": "Yadav", "phone_number": "+91 98765 00004", "role": UserRole.SUPERVISOR},
        {"email": "farmer@satpurajaivik.org", "first_name": "Rameshwar", "last_name": "Patel", "phone_number": "+91 98765 00005", "role": UserRole.FARMER},
        {"email": "management@satpurajaivik.org", "first_name": "Dr. Arvind", "last_name": "Shrivastava", "phone_number": "+91 98765 00006", "role": UserRole.MANAGEMENT},
    ]

    created_users = {}
    for ud in users_data:
        user, created = User.objects.get_or_create(
            email=ud["email"],
            defaults={
                "first_name": ud["first_name"],
                "last_name": ud["last_name"],
                "phone_number": ud["phone_number"],
                "role": ud["role"],
                "is_staff": ud["role"] in [UserRole.SUPER_ADMIN, UserRole.ADMINISTRATOR],
                "is_superuser": ud["role"] == UserRole.SUPER_ADMIN,
            }
        )
        if created:
            user.set_password("Pass@123")
            user.save()
        created_users[ud["role"]] = user
        print(f"  - User ({ud['role']}): {user.email}")

    farmer_user = created_users[UserRole.FARMER]
    supervisor_user = created_users[UserRole.SUPERVISOR]
    accounts_user = created_users[UserRole.ACCOUNTS]

    # 2. Farmer Profile
    farmer_profile, _ = FarmerProfile.objects.get_or_create(
        user=farmer_user,
        defaults={
            "village": "Sohagpur",
            "district": "Hoshangabad",
            "land_acreage": 14.5,
            "primary_crop": "Heirloom Champa Rice & Turmeric",
            "kisan_id": "MP-HOS-2026-8841",
            "aadhar_last4": "4892",
            "gps_lat": 22.75,
            "gps_lng": 77.72,
        }
    )

    # 3. Projects
    project1, _ = FarmProject.objects.get_or_create(
        project_code="SJ-PROJ-101",
        defaults={
            "title": "Bio-Dynamic Organic Rice & Soil Carbon Regeneration Plot",
            "farmer": farmer_user,
            "supervisor": supervisor_user,
            "land_area_acres": 10.0,
            "gps_lat": 22.7512,
            "gps_lng": 77.7245,
            "crop_type": "Heirloom Champa Rice",
            "total_budget": 240000.00,
            "allocated_subsidy": 72000.00,
            "start_date": date(2026, 4, 15),
            "target_completion": date(2026, 11, 30),
            "status": ProjectStatus.IN_PROGRESS,
        }
    )

    project2, _ = FarmProject.objects.get_or_create(
        project_code="SJ-PROJ-102",
        defaults={
            "title": "Rainfed Kodo Millet & Medicinal Wild Turmeric Unit",
            "farmer": farmer_user,
            "supervisor": supervisor_user,
            "land_area_acres": 4.5,
            "gps_lat": 22.6845,
            "gps_lng": 77.8102,
            "crop_type": "Kodo Millet & Wild Turmeric",
            "total_budget": 110000.00,
            "allocated_subsidy": 33000.00,
            "start_date": date(2026, 5, 1),
            "target_completion": date(2026, 12, 15),
            "status": ProjectStatus.VERIFICATION,
        }
    )

    # 4. Expenses Across Workflow Stages
    expenses_data = [
        {
            "project": project1,
            "submitted_by": supervisor_user,
            "title": "Drip Irrigation Pipe Lines & Bio-Fertilizer",
            "category": ExpenseCategory.IRRIGATION,
            "amount": 28500.00,
            "expense_date": date(2026, 8, 12),
            "vendor_name": "Satpura Kisan Agri Tech",
            "gst_number": "23AAAAA0000A1Z5",
            "status": ExpenseStatus.PAID,
            "verification_notes": "GST verified & approved by Admin",
        },
        {
            "project": project1,
            "submitted_by": farmer_user,
            "title": "Solar Dewatering Pump Maintenance",
            "category": ExpenseCategory.MACHINERY,
            "amount": 14200.00,
            "expense_date": date(2026, 9, 2),
            "vendor_name": "Narmada Solar Systems",
            "gst_number": "23BBBBB1111B2Z8",
            "status": ExpenseStatus.ADMIN_APPROVED,
            "verification_notes": "Accounts verified invoice. Ready for bank dispatch.",
        },
        {
            "project": project1,
            "submitted_by": supervisor_user,
            "title": "Labour Payment - Transplanting & Soil Mulching",
            "category": ExpenseCategory.LABOUR,
            "amount": 18000.00,
            "expense_date": date(2026, 9, 25),
            "vendor_name": "Sohagpur Labour Collective",
            "gst_number": "N/A",
            "status": ExpenseStatus.ACCOUNTS_VERIFIED,
            "verification_notes": "Muster roll verified by Accounts.",
        },
        {
            "project": project1,
            "submitted_by": supervisor_user,
            "title": "Vermicompost & Neem Extract Bio Inputs",
            "category": ExpenseCategory.FERTILIZER,
            "amount": 9500.00,
            "expense_date": date(2026, 10, 1),
            "vendor_name": "Satpura Jaivik Bio Center",
            "gst_number": "23CCCCC2222C3Z1",
            "status": ExpenseStatus.SUBMITTED,
            "verification_notes": "Pending Accounts review.",
        }
    ]

    for ed in expenses_data:
        Expense.objects.get_or_create(
            project=ed["project"],
            title=ed["title"],
            defaults=ed
        )

    # 5. Daily Work Log
    DailyWorkLog.objects.get_or_create(
        project=project1,
        log_date=date(2026, 10, 4),
        defaults={
            "supervisor": supervisor_user,
            "gps_checkin_lat": 22.7515,
            "gps_checkin_lng": 77.7248,
            "work_description": "Completed bio-fertilizer application and checked soil moisture sensors across Plot 3.",
            "labor_count": 8,
            "site_expense_amount": 1200.00,
            "is_synced": True,
        }
    )

    # 6. CCTV Camera
    CCTVCamera.objects.get_or_create(
        project=project1,
        camera_name="Camera 01 - Plot North Gateway",
        defaults={
            "stream_url": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800",
            "vendor_name": "Hikvision AgriSurv 4K",
            "status": "ONLINE",
        }
    )

    # 7. IoT Sensors
    IoTSensorDevice.objects.get_or_create(
        project=project1,
        device_name="Soil Moisture Sensor Node A",
        defaults={
            "device_type": "SOIL_MOISTURE",
            "current_reading": 42.8,
            "unit": "%",
            "is_active": True,
        }
    )
    IoTSensorDevice.objects.get_or_create(
        project=project1,
        device_name="Soil EC & pH Monitor",
        defaults={
            "device_type": "PH",
            "current_reading": 6.8,
            "unit": "pH",
            "is_active": True,
        }
    )

    # 8. Chat Messages
    ChatMessage.objects.get_or_create(
        project=project1,
        message_text="Rameshwar ji, the organic soil testing report for Plot 1 is verified. 2.4% organic carbon achieved!",
        defaults={
            "sender": supervisor_user,
            "receiver": farmer_user,
        }
    )

    # 9. Audit Logs
    AuditLog.objects.get_or_create(
        action="PROJECT_STATUS_UPDATE",
        entity="FarmProject",
        defaults={
            "user": supervisor_user,
            "record_id": str(project1.id),
            "ip_address": "192.168.1.45",
            "device_info": "Samsung Galaxy S22 / Satpura PWA App",
        }
    )

    print("[SUCCESS] Seeding completed successfully!")

if __name__ == "__main__":
    seed()
