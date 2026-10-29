"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { WorkerForm, type WorkerFormValues } from "@/components/WorkerForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import { fetchWorker, updateWorker } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function WorkerDetailPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <WorkerDetailContent />
      </RoleGuard>
    </AuthGate>
  );
}

function WorkerDetailContent() {
  const params = useParams<{ id: string }>();
  const workerId = Number(params.id);
  const { t } = useI18n();
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource(
    () => fetchWorker(workerId),
    [workerId],
  );

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (loading) return <Spinner label={t("common.loading")} />;

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">{error ?? t("common.error")}</Alert>
        <Button variant="secondary" size="sm" onClick={reload}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  const handleSubmit = async (values: WorkerFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await updateWorker(workerId, {
        phone_number: values.phone_number.trim(),
        skill: values.skill.trim(),
        daily_wage: values.daily_wage,
        is_active: values.is_active,
      });
      router.push("/workers");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setServerError(caught.message);
        setFieldErrors(caught.fieldErrors);
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
      <PageHeader title={`${t("nav.workers")} · ${data.name}`} />
      <WorkerForm
        initial={{
          name: data.name,
          phone_number: data.phone_number,
          skill: data.skill,
          daily_wage: data.daily_wage,
          is_active: data.is_active,
        }}
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/workers")}
      />
    </div>
  );
}
