"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  Alert,
  Button,
  Card,
  Field,
  Select,
  Spinner,
} from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { fetchWorkLogs, fetchWorkers } from "@/lib/api/projects";
import { createAttendance } from "@/lib/api/attendance";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";
import { ATTENDANCE_STATUSES } from "@/lib/types";

export default function NewAttendancePage() {
  return (
    <AuthGate>
      <RoleGuard roles={["SUPERVISOR"]}>
        <NewAttendanceContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewAttendanceContent() {
  const { t } = useI18n();
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource(async () => {
    const [workLogs, workers] = await Promise.all([
      fetchWorkLogs(),
      fetchWorkers({ active: "true" }),
    ]);
    return { workLogs, workers };
  });

  const [workLog, setWorkLog] = useState("");
  const [worker, setWorker] = useState("");
  const [status, setStatus] = useState("PRESENT");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    if (!workLog) next.work_log = t("common.required");
    if (!worker) next.worker = t("common.required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await createAttendance({
        work_log: Number(workLog),
        worker: Number(worker),
        status: status as (typeof ATTENDANCE_STATUSES)[number],
      });
      router.push("/attendance");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setServerError(caught.message);
        setErrors((current) => {
          const merged = { ...current };
          for (const [key, value] of Object.entries(caught.fieldErrors)) {
            if (value.length) merged[key] = value[0];
          }
          return merged;
        });
      } else {
        setServerError(
          caught instanceof Error ? caught.message : t("common.error"),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("attendance.record")} />
      {loading ? <Spinner label={t("common.loading")} /> : null}
      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {data ? (
        <Card>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {serverError ? <Alert tone="error">{serverError}</Alert> : null}

            <Field
              label={t("attendance.workLog")}
              required
              error={errors.work_log}
            >
              <Select
                value={workLog}
                onChange={(event) => setWorkLog(event.target.value)}
                invalid={Boolean(errors.work_log)}
              >
                <option value="">{t("attendance.selectWorkLog")}</option>
                {data.workLogs.map((log) => (
                  <option key={log.id} value={String(log.id)}>
                    #{log.id} · Project #{log.project} · {log.work_date}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label={t("common.worker")}
              required
              error={errors.worker}
            >
              <Select
                value={worker}
                onChange={(event) => setWorker(event.target.value)}
                invalid={Boolean(errors.worker)}
              >
                <option value="">{t("attendance.selectWorker")}</option>
                {data.workers.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t("common.status")} required>
              <Select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {ATTENDANCE_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {t(
                      item === "PRESENT"
                        ? "attendance.statusPresent"
                        : item === "ABSENT"
                          ? "attendance.statusAbsent"
                          : "attendance.statusHalfDay",
                    )}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={submitting}>
                {t("common.save")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/attendance")}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
