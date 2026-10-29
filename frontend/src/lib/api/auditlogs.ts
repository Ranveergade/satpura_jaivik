import { apiFetch } from "./client";
import type { AuditPage } from "../types";

export async function fetchAuditLogs(
  page: number,
): Promise<AuditPage> {
  const data = await apiFetch<AuditPage>(
    `/api/audit-logs/?page=${page}`,
  );
  return data;
}
