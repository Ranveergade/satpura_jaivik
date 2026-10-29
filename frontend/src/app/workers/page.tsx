"use client";

import Link from "next/link";
import { Plus, Phone } from "lucide-react";
import { useState } from "react";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { fetchWorkers } from "@/lib/api/projects";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { WORKER_MANAGERS } from "@/lib/roles";
import { formatMoney } from "@/lib/format";

const FILTERS = ["all", "active", "inactive"] as const;
type Filter = (typeof FILTERS)[number];

export default function WorkersPage() {
  return (
    <AuthGate>
      <RoleGuard roles={WORKER_MANAGERS}>
        <WorkersContent />
      </RoleGuard>
    </AuthGate>
  );
}

function WorkersContent() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const { data, loading, error, reload } = useApiResource(
    () =>
      fetchWorkers(
        filter === "all" ? {} : { active: filter === "active" ? "true" : "false" },
      ),
    [filter],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("nav.workers")}
        actions={
          <Link href="/workers/new">
            <Button>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("workers.new")}
            </Button>
          </Link>
        }
      />

      <div className="flex gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={filter === item ? "primary" : "secondary"}
            onClick={() => setFilter(item)}
          >
            {item === "all"
              ? t("common.all")
              : item === "active"
                ? t("common.active")
                : t("common.inactive")}
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
        data.length === 0 ? (
          <EmptyState title={t("common.empty")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((worker) => (
              <Link key={worker.id} href={`/workers/${worker.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-forest">
                        {worker.name}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        {worker.phone_number}
                      </p>
                    </div>
                    <Badge tone={worker.is_active ? "green" : "neutral"}>
                      {worker.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-secondary">
                    {worker.skill || t("workers.noSkill")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatMoney(worker.daily_wage)} {t("common.perDay")}
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
