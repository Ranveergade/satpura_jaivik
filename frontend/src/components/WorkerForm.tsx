"use client";

import { useState, type FormEvent } from "react";

import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export type WorkerFormValues = {
  name: string;
  phone_number: string;
  skill: string;
  daily_wage: string;
  is_active: boolean;
};

const EMPTY: WorkerFormValues = {
  name: "",
  phone_number: "",
  skill: "",
  daily_wage: "",
  is_active: true,
};

export function WorkerForm({
  initial,
  submitting,
  serverError,
  fieldErrors,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<WorkerFormValues>;
  submitting: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string[]>;
  onSubmit: (values: WorkerFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<WorkerFormValues>({
    ...EMPTY,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = <K extends keyof WorkerFormValues>(
    key: K,
    value: WorkerFormValues[K],
  ) => {
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
    if (!values.name.trim()) next.name = t("common.required");
    if (!values.phone_number.trim()) {
      next.phone_number = t("common.required");
    }
    if (values.daily_wage === "" || Number(values.daily_wage) < 0) {
      next.daily_wage = "Enter a non-negative amount.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(values);
  };

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {serverError ? <Alert tone="error">{serverError}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("workers.name")} required error={fieldError("name")}>
            <Input
              value={values.name}
              onChange={(event) => setValue("name", event.target.value)}
              invalid={Boolean(fieldError("name"))}
            />
          </Field>
          <Field
            label={t("workers.phone")}
            required
            error={fieldError("phone_number")}
          >
            <Input
              value={values.phone_number}
              onChange={(event) =>
                setValue("phone_number", event.target.value)
              }
              invalid={Boolean(fieldError("phone_number"))}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("workers.skill")}>
            <Input
              value={values.skill}
              onChange={(event) => setValue("skill", event.target.value)}
            />
          </Field>
          <Field
            label={t("workers.dailyWage")}
            required
            error={fieldError("daily_wage")}
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.daily_wage}
              onChange={(event) =>
                setValue("daily_wage", event.target.value)
              }
              invalid={Boolean(fieldError("daily_wage"))}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) =>
              setValue("is_active", event.target.checked)
            }
            className="h-4 w-4 rounded border-secondary/40 text-primary"
          />
          {t("workers.activeLabel")}
        </label>

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
