"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchAuditLogs } from "@/lib/api/auditlogs";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { AUDIT_VIEWERS } from "@/lib/roles";
import { formatDateTime } from "@/lib/format";

export default function AuditLogsPage() {
  return (
    <AuthGate>
      <RoleGuard roles={AUDIT_VIEWERS}>
        <AuditLogsContent />
      </RoleGuard>
    </AuthGate>
  );
}

function AuditLogsContent() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApiResource(
    () => fetchAuditLogs(page),
    [page],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("auditlogs.title")}
        subtitle={
          data
            ? `${data.count} ${t("auditlogs.events")} · ${t("common.page")} ${data.current_page} ${t("common.of")} ${data.total_pages}`
            : undefined
        }
      />

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
        data.results.length === 0 ? (
          <EmptyState title={t("common.empty")} />
        ) : (
          <>
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-secondary/20 bg-pale/60 text-xs uppercase tracking-wide text-secondary">
                  <tr>
                    <th className="px-4 py-3">{t("auditlogs.timestamp")}</th>
                    <th className="px-4 py-3">{t("auditlogs.user")}</th>
                    <th className="px-4 py-3">{t("auditlogs.action")}</th>
                    <th className="px-4 py-3">{t("auditlogs.entity")}</th>
                    <th className="px-4 py-3">{t("auditlogs.record")}</th>
                    <th className="px-4 py-3">{t("auditlogs.changes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-secondary/10 align-top last:border-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-secondary">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {log.username ?? t("auditlogs.system")}
                      </td>
                      <td className="px-4 py-3 text-ink">{log.action}</td>
                      <td className="px-4 py-3 text-secondary">
                        {log.entity_type}
                      </td>
                      <td className="px-4 py-3 text-secondary">
                        {log.record_id}
                      </td>
                      <td className="px-4 py-3">
                        <details>
                          <summary className="cursor-pointer text-xs font-medium text-primary">
                            {t("auditlogs.view")}
                          </summary>
                          <pre className="mt-1 max-w-[240px] overflow-x-auto rounded bg-background p-2 text-xs text-secondary">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("auditlogs.previous")}
              </Button>
              <span className="text-sm text-secondary">
                {t("common.page")} {data.current_page} {t("common.of")}{" "}
                {data.total_pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.total_pages || loading}
                onClick={() =>
                  setPage((current) =>
                    Math.min(data.total_pages, current + 1),
                  )
                }
              >
                {t("auditlogs.next")}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </>
        )
      ) : null}
    </div>
  );
}
