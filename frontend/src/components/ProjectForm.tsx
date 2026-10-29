"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";

import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import {
  PROJECT_STATUSES,
  type FarmerProfile,
  type ProjectStatus,
} from "@/lib/types";

export type ProjectFormValues = {
  farmer_id: string;
  supervisor_id: string;
  land_details: string;
  land_area: string;
  crop_type: string;
  project_budget: string;
  subsidy_amount: string;
  loan_amount: string;
  start_date: string;
  estimated_completion_date: string;
  latitude: string;
  longitude: string;
  status: ProjectStatus;
};

const EMPTY_VALUES: ProjectFormValues = {
  farmer_id: "",
  supervisor_id: "",
  land_details: "",
  land_area: "",
  crop_type: "",
  project_budget: "",
  subsidy_amount: "0",
  loan_amount: "0",
  start_date: "",
  estimated_completion_date: "",
  latitude: "",
  longitude: "",
  status: "PLANNED",
};

export function ProjectForm({
  mode,
  initial,
  farmers,
  submitting,
  serverError,
  fieldErrors,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Partial<ProjectFormValues>;
  farmers?: FarmerProfile[];
  submitting: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string[]>;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<ProjectFormValues>({
    ...EMPTY_VALUES,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof ProjectFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }) as ProjectFormValues);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (mode === "create" && !values.farmer_id) {
      next.farmer_id = t("common.required");
    }
    if (mode === "create" && !values.supervisor_id) {
      next.supervisor_id = t("common.required");
    }
    if (!values.land_details.trim()) {
      next.land_details = t("common.required");
    }
    if (!values.crop_type.trim()) {
      next.crop_type = t("common.required");
    }
    if (!values.land_area || Number(values.land_area) <= 0) {
      next.land_area = "Enter a positive amount.";
    }
    if (values.project_budget === "" || Number(values.project_budget) < 0) {
      next.project_budget = "Enter a non-negative amount.";
    }
    if (!values.start_date) {
      next.start_date = t("common.required");
    }
    if (!values.estimated_completion_date) {
      next.estimated_completion_date = t("common.required");
    } else if (
      values.start_date &&
      values.estimated_completion_date < values.start_date
    ) {
      next.estimated_completion_date =
        "Completion date cannot be before the start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    onSubmit(values);
  };

  const fieldError = (key: string): string | undefined => {
    if (errors[key]) return errors[key];
    const server = fieldErrors[key];
    return server && server.length ? server[0] : undefined;
  };

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {serverError ? <Alert tone="error">{serverError}</Alert> : null}

        {mode === "create" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t("projects.farmer")}
              required
              error={fieldError("farmer_id")}
            >
              {farmers ? (
                <Select
                  value={values.farmer_id}
                  onChange={(event) =>
                    setValue("farmer_id", event.target.value)
                  }
                  invalid={Boolean(fieldError("farmer_id"))}
                >
                  <option value="">{t("projects.farmerSelect")}</option>
                  {farmers.map((farmer) => (
                    <option key={farmer.id} value={String(farmer.user)}>
                      {farmer.username} (account #{farmer.user})
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  inputMode="numeric"
                  value={values.farmer_id}
                  onChange={(event) =>
                    setValue("farmer_id", event.target.value)
                  }
                  invalid={Boolean(fieldError("farmer_id"))}
                />
              )}
            </Field>
            <Field
              label={`${t("projects.supervisor")} (account ID)`}
              required
              error={fieldError("supervisor_id")}
            >
              <Input
                inputMode="numeric"
                value={values.supervisor_id}
                onChange={(event) =>
                  setValue("supervisor_id", event.target.value)
                }
                invalid={Boolean(fieldError("supervisor_id"))}
              />
            </Field>
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-lg bg-pale p-3 text-sm text-secondary">
            <Lock className="h-4 w-4" aria-hidden="true" />
            {t("projects.locked")}
          </p>
        )}

        <Field
          label={t("projects.landDetails")}
          required
          error={fieldError("land_details")}
        >
          <Input
            value={values.land_details}
            onChange={(event) => setValue("land_details", event.target.value)}
            invalid={Boolean(fieldError("land_details"))}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={`${t("projects.landArea")} (${t("projects.hectares")})`}
            required
            error={fieldError("land_area")}
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.land_area}
              onChange={(event) => setValue("land_area", event.target.value)}
              invalid={Boolean(fieldError("land_area"))}
            />
          </Field>
          <Field
            label={t("projects.cropType")}
            required
            error={fieldError("crop_type")}
          >
            <Input
              value={values.crop_type}
              onChange={(event) => setValue("crop_type", event.target.value)}
              invalid={Boolean(fieldError("crop_type"))}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label={t("projects.projectBudget")}
            required
            error={fieldError("project_budget")}
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.project_budget}
              onChange={(event) =>
                setValue("project_budget", event.target.value)
              }
              invalid={Boolean(fieldError("project_budget"))}
            />
          </Field>
          <Field label={t("projects.subsidyAmount")}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.subsidy_amount}
              onChange={(event) =>
                setValue("subsidy_amount", event.target.value)
              }
            />
          </Field>
          <Field label={t("projects.loanAmount")}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.loan_amount}
              onChange={(event) => setValue("loan_amount", event.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("projects.startDate")}
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
            label={t("projects.estimatedCompletionDate")}
            required
            error={fieldError("estimated_completion_date")}
          >
            <Input
              type="date"
              value={values.estimated_completion_date}
              onChange={(event) =>
                setValue("estimated_completion_date", event.target.value)
              }
              invalid={Boolean(fieldError("estimated_completion_date"))}
            />
          </Field>
        </div>

        {mode === "edit" ? (
          <Field label={t("projects.status")} error={fieldError("status")}>
            <Select
              value={values.status}
              onChange={(event) => setValue("status", event.target.value)}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`projects.status.${status}`)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("worklogs.checkInLatitude")}>
            <Input
              type="number"
              step="0.000001"
              value={values.latitude}
              onChange={(event) => setValue("latitude", event.target.value)}
            />
          </Field>
          <Field label={t("worklogs.checkInLongitude")}>
            <Input
              type="number"
              step="0.000001"
              value={values.longitude}
              onChange={(event) => setValue("longitude", event.target.value)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={submitting}>
            {mode === "create"
              ? t("projects.save")
              : t("projects.update")}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
