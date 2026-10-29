"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  AssignmentForm,
  type AssignmentFormValues,
} from "@/components/AssignmentForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import {
  createAssignment,
  fetchProjects,
  fetchWorkers,
} from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function NewAssignmentPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <NewAssignmentContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewAssignmentContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { data, loading, error, reload } = useApiResource(async () => {
    const [projects, workers] = await Promise.all([
      fetchProjects(),
      fetchWorkers({ active: "true" }),
    ]);
    return { projects, workers };
  });

  const handleSubmit = async (values: AssignmentFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await createAssignment({
        project: Number(values.project),
        worker: Number(values.worker),
        start_date: values.start_date,
        end_date: values.end_date || null,
        agreed_daily_wage: values.agreed_daily_wage,
      });
      router.push("/assignments");
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
      <PageHeader title={t("assignments.new")} />
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
        <AssignmentForm
          mode="create"
          projects={data.projects}
          workers={data.workers}
          submitting={submitting}
          serverError={serverError}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/assignments")}
        />
      ) : null}
    </div>
  );
}
