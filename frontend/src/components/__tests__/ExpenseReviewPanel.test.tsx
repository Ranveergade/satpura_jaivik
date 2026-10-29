import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExpenseReviewPanel } from "@/components/ExpenseReviewPanel";
import { I18nProvider } from "@/lib/i18n";
import type { Expense, Role } from "@/lib/types";

const reviewExpense = vi.fn();

vi.mock("@/lib/api/expenses", () => ({
  reviewExpense: (...args: unknown[]) => reviewExpense(...args),
}));

function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: 12,
    project: 3,
    submitted_by: "supervisor1",
    amount: "1500.00",
    category: "MATERIALS",
    description: "Seeds",
    expense_date: "2026-10-01",
    status: "PENDING",
    reviewed_by: null,
    review_note: "",
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-01T10:00:00Z",
    ...overrides,
  };
}

function renderPanel({
  role = "ADMINISTRATOR" as Role,
  username = "admin1",
  expense = makeExpense(),
  onReviewed = vi.fn(),
} = {}) {
  render(
    <I18nProvider>
      <ExpenseReviewPanel
        expense={expense}
        role={role}
        currentUsername={username}
        onReviewed={onReviewed}
      />
    </I18nProvider>,
  );
  return { onReviewed };
}

beforeEach(() => {
  reviewExpense.mockReset();
  reviewExpense.mockResolvedValue(makeExpense({ status: "REJECTED" }));
});

describe("ExpenseReviewPanel", () => {
  it("is hidden for roles that cannot review", () => {
    renderPanel({ role: "SUPERVISOR" });
    expect(screen.queryByText("Review expense")).not.toBeInTheDocument();
  });

  it("blocks rejection until a reason is provided", async () => {
    renderPanel();

    await userEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(
      screen.getByText("A reason is required when rejecting an expense."),
    ).toBeInTheDocument();
    expect(reviewExpense).not.toHaveBeenCalled();
  });

  it("requires inline confirmation and submits the rejection note", async () => {
    const { onReviewed } = renderPanel();

    await userEvent.type(
      screen.getByRole("textbox"),
      "Receipt does not match the amount.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));

    expect(reviewExpense).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Confirm: Reject/),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /Confirm Reject/ }),
    );

    expect(reviewExpense).toHaveBeenCalledWith(12, {
      decision: "REJECTED",
      review_note: "Receipt does not match the amount.",
    });
    expect(
      await screen.findByText("Expense rejected."),
    ).toBeInTheDocument();
    expect(onReviewed).toHaveBeenCalled();
  });

  it("does not offer review for an already-decided expense", () => {
    renderPanel({ expense: makeExpense({ status: "APPROVED" }) });
    expect(
      screen.getByText(/already decided and cannot be reviewed again/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Approve" }),
    ).not.toBeInTheDocument();
  });

  it("blocks self-review", () => {
    renderPanel({ username: "supervisor1" });
    expect(
      screen.getByText("You cannot review your own expense."),
    ).toBeInTheDocument();
  });
});
