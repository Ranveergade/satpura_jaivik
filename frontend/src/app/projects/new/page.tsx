"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { ProjectForm, type ProjectFormValues } from "@/components/ProjectForm";
import { Alert, Button, Spinner } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { PROJECT_MANAGERS } from "@/lib/roles";
import { createProject } from "@/lib/api/projects";
import { fetchFarmerProfiles } from "@/lib/api/farmerprofiles";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

export default function NewProjectPage() {
  return (
    <AuthGate>
      <RoleGuard roles={PROJECT_MANAGERS}>
        <NewProjectContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewProjectContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const {
    data: farmers,
    loading,
    error,
    reload,
  } = useApiResource(fetchFarmerProfiles);

  const handleSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      const project = await createProject({
        farmer_id: Number(values.farmer_id),
        supervisor_id: Number(values.supervisor_id),
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
      });
      router.push(`/projects/${project.id}`);
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
      <PageHeader title={t("projects.new")} />

      {loading ? <Spinner label={t("common.loading")} /> : null}

      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {farmers ? (
        <ProjectForm
          mode="create"
          farmers={farmers}
          submitting={submitting}
          serverError={serverError}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/projects")}
        />
      ) : null}
    </div>
  );
}
