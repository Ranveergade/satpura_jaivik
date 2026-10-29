"use client";

import { useState, type FormEvent } from "react";

import { Alert, Button, Card, Field, Input, Textarea } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export type FarmerProfileFormValues = {
  user: string;
  phone_number: string;
  address: string;
  village: string;
  date_of_birth: string;
  emergency_contact: string;
};

const EMPTY: FarmerProfileFormValues = {
  user: "",
  phone_number: "",
  address: "",
  village: "",
  date_of_birth: "",
  emergency_contact: "",
};

export function FarmerProfileForm({
  mode,
  initial,
  submitting,
  serverError,
  fieldErrors,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: Partial<FarmerProfileFormValues>;
  submitting: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string[]>;
  onSubmit: (values: FarmerProfileFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<FarmerProfileFormValues>({
    ...EMPTY,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: keyof FarmerProfileFormValues, value: string) => {
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
    if (mode === "create" && !values.user.trim()) {
      next.user = "A farmer account ID is required.";
    }
    if (!values.phone_number.trim()) {
      next.phone_number = t("common.required");
    }
    if (!values.address.trim()) {
      next.address = t("common.required");
    }
    if (!values.village.trim()) {
      next.village = t("common.required");
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
          <Field
            label={t("farmers.accountId")}
            required
            error={fieldError("user")}
          >
            <Input
              inputMode="numeric"
              value={values.user}
              onChange={(event) => setValue("user", event.target.value)}
              invalid={Boolean(fieldError("user"))}
            />
          </Field>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("farmers.phone")}
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
          <Field
            label={t("farmers.village")}
            required
            error={fieldError("village")}
          >
            <Input
              value={values.village}
              onChange={(event) => setValue("village", event.target.value)}
              invalid={Boolean(fieldError("village"))}
            />
          </Field>
        </div>

        <Field
          label={t("farmers.address")}
          required
          error={fieldError("address")}
        >
          <Textarea
            rows={2}
            value={values.address}
            onChange={(event) => setValue("address", event.target.value)}
            invalid={Boolean(fieldError("address"))}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("farmers.dob")}>
            <Input
              type="date"
              value={values.date_of_birth}
              onChange={(event) => setValue("date_of_birth", event.target.value)}
            />
          </Field>
          <Field label={t("farmers.emergency")}>
            <Input
              value={values.emergency_contact}
              onChange={(event) =>
                setValue("emergency_contact", event.target.value)
              }
            />
          </Field>
        </div>

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
