"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { ExpenseStatusBadge } from "@/components/PageHeader";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchExpenses } from "@/lib/api/expenses";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { hasRole, EXPENSE_SUBMITTERS } from "@/lib/roles";
import { formatDate, formatMoney } from "@/lib/format";
import { EXPENSE_STATUSES, type ExpenseStatus } from "@/lib/types";

type Filter = "ALL" | ExpenseStatus;

export default function ExpensesPage() {
  return (
    <AuthGate>
      <ExpensesContent />
    </AuthGate>
  );
}

function ExpensesContent() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiResource(fetchExpenses);
  const [filter, setFilter] = useState<Filter>("ALL");
  const canSubmit = hasRole(user?.role ?? null, EXPENSE_SUBMITTERS);

  const visible = (data ?? []).filter(
    (expense) => filter === "ALL" || expense.status === filter,
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("expenses.title")}
        actions={
          canSubmit ? (
            <Link href="/expenses/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("expenses.new")}
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...EXPENSE_STATUSES] as Filter[]).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={filter === item ? "primary" : "secondary"}
            onClick={() => setFilter(item)}
          >
            {item === "ALL"
              ? t("common.all")
              : item === "PENDING"
                ? t("expenses.statusPending")
                : item === "APPROVED"
                  ? t("expenses.statusApproved")
                  : t("expenses.statusRejected")}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {loading ? <Spinner label={t("common.loading")} /> : null}

      {!loading && !error && data ? (
        visible.length === 0 ? (
          <EmptyState title={t("common.empty")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((expense) => (
              <Link key={expense.id} href={`/expenses/${expense.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-secondary">
                        {t("expenses.expense")} #{expense.id} ·{" "}
                        {t("expenses.projectNumber")} #{expense.project}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-forest">
                        {formatMoney(expense.amount)}
                      </h2>
                    </div>
                    <ExpenseStatusBadge
                      status={expense.status}
                      label={t(
                        expense.status === "PENDING"
                          ? "expenses.statusPending"
                          : expense.status === "APPROVED"
                            ? "expenses.statusApproved"
                            : "expenses.statusRejected",
                      )}
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-secondary">
                    {expense.description}
                  </p>
                  <p className="mt-2 text-xs text-secondary">
                    {t(`expenses.category.${expense.category}`)} ·{" "}
                    {formatDate(expense.expense_date)} ·{" "}
                    {expense.submitted_by}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
