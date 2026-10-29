"use client";

import { useState } from "react";

import { Alert, Button, Card, Field, Textarea } from "@/components/ui";
import { reviewExpense } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/errors";
import { useI18n } from "@/lib/i18n";
import { EXPENSE_REVIEWERS, hasRole } from "@/lib/roles";
import { formatMoney } from "@/lib/format";
import type { Expense, Role } from "@/lib/types";

type Decision = "APPROVED" | "REJECTED";

export function ExpenseReviewPanel({
  expense,
  role,
  currentUsername,
  onReviewed,
}: {
  expense: Expense;
  role: Role | null;
  currentUsername: string | undefined;
  onReviewed: () => void;
}) {
  const { t } = useI18n();
  const [decision, setDecision] = useState<Decision>("APPROVED");
  const [reviewNote, setReviewNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!hasRole(role, EXPENSE_REVIEWERS)) return null;

  const isOwnExpense = currentUsername === expense.submitted_by;

  if (expense.status !== "PENDING") {
    return (
      <Card>
        <h2 className="mb-3 font-semibold text-forest">
          {t("expenses.review")}
        </h2>
        <Alert tone="info">{t("expenses.alreadyReviewed")}</Alert>
      </Card>
    );
  }

  if (isOwnExpense) {
    return (
      <Card>
        <h2 className="mb-3 font-semibold text-forest">
          {t("expenses.review")}
        </h2>
        <Alert tone="info">{t("expenses.cannotReviewOwn")}</Alert>
      </Card>
    );
  }

  const requestReview = (next: Decision) => {
    setReviewError(null);
    setSuccess(null);
    if (next === "REJECTED" && !reviewNote.trim()) {
      setReviewError(t("expenses.rejectReasonRequired"));
      return;
    }
    setDecision(next);
    setConfirming(true);
  };

  const submitReview = async () => {
    setSubmitting(true);
    setReviewError(null);
    try {
      await reviewExpense(expense.id, {
        decision,
        review_note: reviewNote.trim(),
      });
      setConfirming(false);
      setSuccess(
        decision === "APPROVED"
          ? t("expenses.approvedMessage")
          : t("expenses.rejectedMessage"),
      );
      onReviewed();
    } catch (caught) {
      setReviewError(
        caught instanceof ApiError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : t("common.error"),
      );
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-3 font-semibold text-forest">
        {t("expenses.review")}
      </h2>

      <div className="flex flex-col gap-4">
        {success ? <Alert tone="success">{success}</Alert> : null}
        {reviewError ? <Alert tone="error">{reviewError}</Alert> : null}

        <Field label={t("expenses.reviewNote")}>
          <Textarea
            rows={3}
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
            placeholder={t("expenses.reviewPlaceholder")}
          />
        </Field>

        {confirming ? (
          <div className="flex flex-col gap-3 rounded-lg border border-amber/40 bg-amber/5 p-3">
            <p className="text-sm text-ink">
              {t("common.confirm")}:{" "}
              {decision === "APPROVED"
                ? t("expenses.decisionApprove")
                : t("expenses.decisionReject")}{" "}
              — {formatMoney(expense.amount)}?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={decision === "APPROVED" ? "primary" : "danger"}
                loading={submitting}
                onClick={() => void submitReview()}
              >
                Confirm{" "}
                {decision === "APPROVED"
                  ? t("expenses.decisionApprove")
                  : t("expenses.decisionReject")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirming(false)}
                disabled={submitting}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => requestReview("APPROVED")}>
              {t("expenses.decisionApprove")}
            </Button>
            <Button
              variant="danger"
              onClick={() => requestReview("REJECTED")}
            >
              {t("expenses.decisionReject")}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
