"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader, ProjectStatusBadge } from "@/components/PageHeader";
import { Alert, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useApiResource } from "@/lib/useApiResource";
import { fetchProjects } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { hasRole, PROJECT_MANAGERS } from "@/lib/roles";
import { formatMoney } from "@/lib/format";

export default function ProjectsPage() {
  return (
    <AuthGate>
      <ProjectsContent />
    </AuthGate>
  );
}

function ProjectsContent() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { data, loading, error, reload } = useApiResource(fetchProjects);
  const canManage = hasRole(user?.role ?? null, PROJECT_MANAGERS);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("projects.title")}
        subtitle={t("projects.visibleSubtitle")}
        actions={
          canManage ? (
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("projects.new")}
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
          <EmptyState title={t("common.empty")} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-secondary">
                        Project #{project.id}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-forest">
                        {project.crop_type}
                      </h2>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <dl className="mt-3 space-y-1 text-sm text-secondary">
                    <div className="flex justify-between gap-2">
                      <dt>{t("projects.farmer")}</dt>
                      <dd className="font-medium text-ink">
                        {project.farmer}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>{t("projects.supervisor")}</dt>
                      <dd className="font-medium text-ink">
                        {project.supervisor}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt>{t("projects.projectBudget")}</dt>
                      <dd className="font-medium text-ink">
                        {formatMoney(project.project_budget)}
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
