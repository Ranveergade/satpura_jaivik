"""Create the initial accounts from environment variables.

Production host builds run this once per deployment. It is idempotent: an
existing username is left untouched, so passwords are never reset by a
redeploy. Nothing is created unless the matching BOOTSTRAP_<PREFIX>_* values
are present in the environment.
"""

import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create initial admin, supervisor, and farmer accounts from env vars."

    # prefix, role, is_staff
    ACCOUNTS = (
        ("ADMIN", "SUPER_ADMINISTRATOR", True),
        ("SUPERVISOR", "SUPERVISOR", False),
        ("FARMER", "FARMER", False),
    )

    def handle(self, *args, **options):
        User = get_user_model()
        created = []

        for prefix, role, is_staff in self.ACCOUNTS:
            username = os.getenv(f"BOOTSTRAP_{prefix}_USERNAME", "").strip()
            email = os.getenv(f"BOOTSTRAP_{prefix}_EMAIL", "").strip()
            password = os.getenv(f"BOOTSTRAP_{prefix}_PASSWORD", "")
            if not (username and email and password):
                continue

            if User.objects.filter(username=username).exists():
                self.stdout.write(f"{username}: already exists")
                continue

            if is_staff:
                User.objects.create_superuser(
                    username=username, email=email, password=password, role=role
                )
            else:
                User.objects.create_user(
                    username=username, email=email, password=password, role=role
                )
            created.append(username)

        self.stdout.write(
            "bootstrap users created: " + (", ".join(created) if created else "none")
        )
