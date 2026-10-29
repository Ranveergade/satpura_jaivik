"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { EXPENSE_SUBMITTERS } from "@/lib/roles";
import { fetchProjects } from "@/lib/api/projects";
import { createExpense } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/types";

function todayIso(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function NewExpensePage() {
  return (
    <AuthGate>
      <RoleGuard roles={EXPENSE_SUBMITTERS}>
        <NewExpenseContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewExpenseContent() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: projects, loading, error, reload } =
    useApiResource(fetchProjects);

  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("MATERIALS");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(todayIso());
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    if (!project) next.project = t("common.required");
    if (!amount || Number(amount) <= 0) {
      next.amount = "Amount must be greater than zero.";
    }
    if (!description.trim()) {
      next.description = t("common.required");
    }
    if (!expenseDate) {
      next.expense_date = t("common.required");
    } else if (expenseDate > todayIso()) {
      next.expense_date = "Expense date cannot be in the future.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const expense = await createExpense({
        project: Number(project),
        amount,
        category,
        description: description.trim(),
        expense_date: expenseDate,
      });
      router.push(`/expenses/${expense.id}`);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setServerError(caught.message);
        setErrors((current) => {
          const merged = { ...current };
          for (const [key, value] of Object.entries(caught.fieldErrors)) {
            if (value.length) merged[key] = value[0];
          }
          return merged;
        });
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
      <PageHeader title={t("expenses.new")} />
      {loading ? <Spinner label={t("common.loading")} /> : null}
      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {projects ? (
        <Card>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {serverError ? <Alert tone="error">{serverError}</Alert> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("common.project")}
                required
                error={errors.project}
              >
                <Select
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  invalid={Boolean(errors.project)}
                >
                  <option value="">{t("assignments.selectProject")}</option>
                  {projects.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      #{item.id} · {item.crop_type}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label={t("expenses.amountLabel")}
                required
                error={errors.amount}
              >
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  invalid={Boolean(errors.amount)}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("common.category")}
                required
                error={errors.category}
              >
                <Select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as ExpenseCategory)
                  }
                >
                  {EXPENSE_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {t(`expenses.category.${item}`)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label={t("expenses.expenseDate")}
                required
                error={errors.expense_date}
              >
                <Input
                  type="date"
                  max={todayIso()}
                  value={expenseDate}
                  onChange={(event) => setExpenseDate(event.target.value)}
                  invalid={Boolean(errors.expense_date)}
                />
              </Field>
            </div>

            <Field
              label={t("common.description")}
              required
              error={errors.description}
            >
              <Textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                invalid={Boolean(errors.description)}
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={submitting}>
                {t("expenses.submit")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/expenses")}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
