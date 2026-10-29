"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  AssignmentForm,
  type AssignmentFormValues,
} from "@/components/AssignmentForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import { fetchAssignment, updateAssignment } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function AssignmentDetailPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <AssignmentDetailContent />
      </RoleGuard>
    </AuthGate>
  );
}

function AssignmentDetailContent() {
  const params = useParams<{ id: string }>();
  const assignmentId = Number(params.id);
  const { t } = useI18n();
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource(
    () => fetchAssignment(assignmentId),
    [assignmentId],
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

  const handleSubmit = async (values: AssignmentFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await updateAssignment(assignmentId, {
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
      <PageHeader
        title={`${data.worker_name} · ${data.project_name}`}
        subtitle={`${t("assignments.assignedBy")} ${data.assigned_by_username}`}
      />
      <AssignmentForm
        mode="edit"
        projects={[]}
        workers={[]}
        initial={{
          start_date: data.start_date,
          end_date: data.end_date ?? "",
          agreed_daily_wage: data.agreed_daily_wage,
        }}
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/assignments")}
      />
    </div>
  );
}
