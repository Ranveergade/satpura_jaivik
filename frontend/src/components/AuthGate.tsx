"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { hasRole } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { Alert, Spinner } from "@/components/ui";

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Spinner label={t("common.loading")} />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

export function RoleGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!hasRole(user?.role ?? null, roles)) {
    return (
      <Alert tone="error">
        You do not have permission to view this page.
      </Alert>
    );
  }

  return <>{children}</>;
}
