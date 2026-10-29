import { apiFetch } from "./client";
import type { CreateExpenseInput, Expense, ReviewExpenseInput } from "../types";

export async function fetchExpenses(): Promise<Expense[]> {
  const data = await apiFetch<Expense[]>("/api/expenses/");
  return data;
}

export async function createExpense(
  input: CreateExpenseInput,
): Promise<Expense> {
  const data = await apiFetch<Expense>("/api/expenses/", {
    method: "POST",
    body: input,
  });
  return data;
}

export async function reviewExpense(
  expenseId: number,
  input: ReviewExpenseInput,
): Promise<Expense> {
  const data = await apiFetch<Expense>(
    `/api/expenses/${expenseId}/review/`,
    { method: "POST", body: input },
  );
  return data;
}
