"use client";

import { useState, type FormEvent } from "react";

import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import type { ProjectListItem, Worker } from "@/lib/types";

export type AssignmentFormValues = {
  project: string;
  worker: string;
  start_date: string;
  end_date: string;
  agreed_daily_wage: string;
};

const EMPTY: AssignmentFormValues = {
  project: "",
  worker: "",
  start_date: "",
  end_date: "",
  agreed_daily_wage: "",
};

export function AssignmentForm({
  mode,
  initial,
  projects,
  workers,
  submitting,
  serverError,
  fieldErrors,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Partial<AssignmentFormValues>;
  projects: ProjectListItem[];
  workers: Worker[];
  submitting: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string[]>;
  onSubmit: (values: AssignmentFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<AssignmentFormValues>({
    ...EMPTY,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof AssignmentFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const fieldError = (key: string): string | undefined => {
    if (errors[key]) return errors[key];
    const server = fieldErrors[key];
    return server && server.length ? server[0] : undefined;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    if (mode === "create" && !values.project) {
      next.project = t("common.required");
    }
    if (mode === "create" && !values.worker) {
      next.worker = t("common.required");
    }
    if (!values.start_date) next.start_date = t("common.required");
    if (values.agreed_daily_wage === "" || Number(values.agreed_daily_wage) < 0) {
      next.agreed_daily_wage = "Enter a non-negative amount.";
    }
    if (
      values.end_date &&
      values.start_date &&
      values.end_date < values.start_date
    ) {
      next.end_date = "End date cannot be before start date.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(values);
  };

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {serverError ? <Alert tone="error">{serverError}</Alert> : null}

        {mode === "create" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t("common.project")}
              required
              error={fieldError("project")}
            >
              <Select
                value={values.project}
                onChange={(event) => setValue("project", event.target.value)}
                invalid={Boolean(fieldError("project"))}
              >
                <option value="">{t("assignments.selectProject")}</option>
                {projects.map((project) => (
                  <option key={project.id} value={String(project.id)}>
                    #{project.id} · {project.crop_type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label={t("common.worker")}
              required
              error={fieldError("worker")}
            >
              <Select
                value={values.worker}
                onChange={(event) => setValue("worker", event.target.value)}
                invalid={Boolean(fieldError("worker"))}
              >
                <option value="">{t("assignments.selectWorker")}</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={String(worker.id)}>
                    {worker.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("assignments.startDate")}
            required
            error={fieldError("start_date")}
          >
            <Input
              type="date"
              value={values.start_date}
              onChange={(event) => setValue("start_date", event.target.value)}
              invalid={Boolean(fieldError("start_date"))}
            />
          </Field>
          <Field
            label={t("assignments.endDate")}
            error={fieldError("end_date")}
          >
            <Input
              type="date"
              value={values.end_date}
              onChange={(event) => setValue("end_date", event.target.value)}
              invalid={Boolean(fieldError("end_date"))}
            />
          </Field>
        </div>

        <Field
          label={t("assignments.agreedWage")}
          required
          error={fieldError("agreed_daily_wage")}
        >
          <Input
            type="number"
            min="0"
            step="0.01"
            value={values.agreed_daily_wage}
            onChange={(event) =>
              setValue("agreed_daily_wage", event.target.value)
            }
            invalid={Boolean(fieldError("agreed_daily_wage"))}
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={submitting}>
            {t("common.save")}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
