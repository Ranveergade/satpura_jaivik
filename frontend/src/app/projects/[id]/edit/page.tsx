"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { ProjectForm, type ProjectFormValues } from "@/components/ProjectForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { PROJECT_MANAGERS } from "@/lib/roles";
import { fetchProject, updateProject } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function EditProjectPage() {
  return (
    <AuthGate>
      <RoleGuard roles={PROJECT_MANAGERS}>
        <EditProjectContent />
      </RoleGuard>
    </AuthGate>
  );
}

function EditProjectContent() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const { t } = useI18n();
  const router = useRouter();
  const { data, loading, error, reload } = useApiResource(
    () => fetchProject(projectId),
    [projectId],
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

  const handleSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await updateProject(projectId, {
        land_details: values.land_details.trim(),
        land_area: values.land_area,
        crop_type: values.crop_type.trim(),
        project_budget: values.project_budget,
        subsidy_amount: values.subsidy_amount || "0",
        loan_amount: values.loan_amount || "0",
        start_date: values.start_date,
        estimated_completion_date: values.estimated_completion_date,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        status: values.status,
      });
      router.push(`/projects/${projectId}`);
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
      <PageHeader title={`${t("projects.edit")} · #${data.id}`} />
      <ProjectForm
        mode="edit"
        initial={{
          land_details: data.land_details,
          land_area: data.land_area,
          crop_type: data.crop_type,
          project_budget: data.project_budget,
          subsidy_amount: data.subsidy_amount,
          loan_amount: data.loan_amount,
          start_date: data.start_date,
          estimated_completion_date: data.estimated_completion_date,
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          status: data.status,
        }}
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/projects/${projectId}`)}
      />
    </div>
  );
}
