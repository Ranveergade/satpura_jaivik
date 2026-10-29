"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchWorkLogs } from "@/lib/api/projects";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { hasRole } from "@/lib/roles";
import { formatDate } from "@/lib/format";

export default function WorkLogsPage() {
  return (
    <AuthGate>
      <WorkLogsContent />
    </AuthGate>
  );
}

function WorkLogsContent() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, loading, error, reload } = useApiResource(fetchWorkLogs);
  const canCreate = hasRole(user?.role ?? null, ["SUPERVISOR"]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("nav.workLogs")}
        actions={
          canCreate ? (
            <Link href="/work-logs/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("worklogs.new")}
              </Button>
            </Link>
          ) : null
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
        data.length === 0 ? (
          <EmptyState
            title={t("common.empty")}
            message={t("worklogs.emptyMessage")}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.map((log) => (
              <Link key={log.id} href={`/work-logs/${log.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-secondary">
                        Project #{log.project}
                      </p>
                      <h2 className="mt-1 font-semibold text-forest">
                        {formatDate(log.work_date)}
                      </h2>
                    </div>
                    <Badge tone="green">
                      {log.laborers_present} {t("worklogs.workers")}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-secondary">
                    {log.activities}
                  </p>
                  <p className="mt-2 text-xs text-secondary">
                    {log.supervisor}
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
