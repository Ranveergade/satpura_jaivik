"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { WorkerForm, type WorkerFormValues } from "@/components/WorkerForm";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import { createWorker } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";

export default function NewWorkerPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <NewWorkerContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewWorkerContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (values: WorkerFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setFieldErrors({});
    try {
      await createWorker({
        name: values.name.trim(),
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
      <PageHeader title={t("workers.new")} />
      <WorkerForm
        submitting={submitting}
        serverError={serverError}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/workers")}
      />
    </div>
  );
}
