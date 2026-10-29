"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Spinner,
} from "@/components/ui";
import { AttendanceStatusBadge } from "@/components/PageHeader";
import { fetchAttendance } from "@/lib/api/attendance";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { hasRole } from "@/lib/roles";
import { formatDateTime } from "@/lib/format";

export default function AttendancePage() {
  return (
    <AuthGate>
      <AttendanceContent />
    </AuthGate>
  );
}

function AttendanceContent() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiResource(fetchAttendance);
  const canRecord = hasRole(user?.role ?? null, ["SUPERVISOR"]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("nav.attendance")}
        actions={
          canRecord ? (
            <Link href="/attendance/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("attendance.record")}
              </Button>
            </Link>
          ) : null
        }
      />

      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {loading ? <Spinner label={t("common.loading")} /> : null}

      {!loading && !error && data ? (
        data.length === 0 ? (
          <EmptyState
            title={t("common.empty")}
            message={t("attendance.emptyMessage")}
          />
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-secondary/20 bg-pale/60 text-xs uppercase tracking-wide text-secondary">
                <tr>
                  <th className="px-4 py-3">{t("common.worker")}</th>
                  <th className="px-4 py-3">{t("attendance.workLog")}</th>
                  <th className="px-4 py-3">{t("common.status")}</th>
                  <th className="px-4 py-3">{t("attendance.recordedBy")}</th>
                  <th className="px-4 py-3">{t("attendance.recordedAt")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-secondary/10 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {record.worker_name}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      #{record.work_log}
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceStatusBadge
                        status={record.status}
                        label={t(
                          record.status === "PRESENT"
                            ? "attendance.statusPresent"
                            : record.status === "ABSENT"
                              ? "attendance.statusAbsent"
                              : "attendance.statusHalfDay",
                        )}
                      />
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {record.recorded_by}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {formatDateTime(record.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      ) : null}
    </div>
  );
}
