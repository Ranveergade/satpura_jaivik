"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchAssignments } from "@/lib/api/projects";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import { formatDate, formatMoney } from "@/lib/format";

export default function AssignmentsPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <AssignmentsContent />
      </RoleGuard>
    </AuthGate>
  );
}

function AssignmentsContent() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useApiResource(fetchAssignments);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("nav.assignments")}
        actions={
          <Link href="/assignments/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("assignments.new")}
            </Button>
          </Link>
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
          <EmptyState title={t("common.empty")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.map((assignment) => (
              <Link key={assignment.id} href={`/assignments/${assignment.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-forest">
                        {assignment.worker_name}
                      </h2>
                      <p className="text-sm text-secondary">
                        {assignment.project_name}
                      </p>
                    </div>
                    <Badge tone={assignment.is_active ? "green" : "neutral"}>
                      {assignment.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </Badge>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm text-secondary">
                    <div className="flex justify-between gap-2">
                      <dt>{t("common.wage")}</dt>
                      <dd className="font-medium text-ink">
                        {formatMoney(assignment.agreed_daily_wage)}{" "}
                        {t("common.perDay")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>{t("common.start")}</dt>
                      <dd className="font-medium text-ink">
                        {formatDate(assignment.start_date)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>{t("common.end")}</dt>
                      <dd className="font-medium text-ink">
                        {formatDate(assignment.end_date)}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
