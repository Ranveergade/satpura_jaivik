"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { AuthGate } from "@/components/AuthGate";
import { ExpenseReviewPanel } from "@/components/ExpenseReviewPanel";
import { ExpenseStatusBadge, PageHeader } from "@/components/PageHeader";
import { Alert, Button, Card, Spinner } from "@/components/ui";
import { fetchExpenses } from "@/lib/api/expenses";
import { useApiResource } from "@/lib/useApiResource";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatMoney } from "@/lib/format";

export default function ExpenseDetailPage() {
  return (
    <AuthGate>
      <ExpenseDetailContent />
    </AuthGate>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-secondary/10 py-2 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-secondary">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function ExpenseDetailContent() {
  const params = useParams<{ id: string }>();
  const expenseId = Number(params.id);
  const { user } = useAuth();
  const { t } = useI18n();

  const { data, loading, error, reload } = useApiResource(async () => {
    const expenses = await fetchExpenses();
    return expenses.find((item) => item.id === expenseId) ?? null;
  }, [expenseId]);

  if (loading) return <Spinner label={t("common.loading")} />;

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">{error}</Alert>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
          <Link href="/expenses">
            <Button variant="ghost" size="sm">
              {t("common.back")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">
          Expense #{expenseId}: {t("expenses.notFound")}
        </Alert>
        <Link href="/expenses">
          <Button variant="secondary" size="sm">
            {t("common.back")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`${t("expenses.expense")} #${data.id}`}
        subtitle={`${t("expenses.projectNumber")} #${data.project} · ${formatDate(data.expense_date)}`}
        actions={
          <Link href="/expenses">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("common.back")}
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-forest">{t("expenses.title")}</h2>
          <ExpenseStatusBadge
            status={data.status}
            label={t(
              data.status === "PENDING"
                ? "expenses.statusPending"
                : data.status === "APPROVED"
                  ? "expenses.statusApproved"
                  : "expenses.statusRejected",
            )}
          />
        </div>
        <dl>
          <Row label={t("common.amount")} value={formatMoney(data.amount)} />
          <Row
            label={t("common.category")}
            value={t(`expenses.category.${data.category}`)}
          />
          <Row
            label={t("expenses.expenseDate")}
            value={formatDate(data.expense_date)}
          />
          <Row label={t("expenses.submittedBy")} value={data.submitted_by} />
          <Row label={t("common.description")} value={data.description} />
          <Row
            label={t("expenses.reviewedBy")}
            value={data.reviewed_by ?? "—"}
          />
          <Row
            label={t("expenses.reviewNote")}
            value={data.review_note || "—"}
          />
        </dl>
      </Card>

      <ExpenseReviewPanel
        expense={data}
        role={user?.role ?? null}
        currentUsername={user?.username}
        onReviewed={reload}
      />
    </div>
  );
}
