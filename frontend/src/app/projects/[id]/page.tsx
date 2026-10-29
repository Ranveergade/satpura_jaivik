"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams } from "next/navigation";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader, ProjectStatusBadge } from "@/components/PageHeader";
import { Alert, Button, Card, Spinner } from "@/components/ui";
import { useApiResource } from "@/lib/useApiResource";
import { fetchProject } from "@/lib/api/projects";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { hasRole, PROJECT_MANAGERS } from "@/lib/roles";
import { formatDate, formatMoney } from "@/lib/format";

export default function ProjectDetailPage() {
  return (
    <AuthGate>
      <ProjectDetailContent />
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

function ProjectDetailContent() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const { user } = useAuth();
  const { t } = useI18n();
  const { data, loading, error, reload } = useApiResource(
    () => fetchProject(projectId),
    [projectId],
  );
  const canManage = hasRole(user?.role ?? null, PROJECT_MANAGERS);

  if (loading) return <Spinner label={t("common.loading")} />;

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">{error ?? t("common.error")}</Alert>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              {t("common.back")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`${data.crop_type} · Project #${data.id}`}
        subtitle={`${data.farmer} → ${data.supervisor}`}
        actions={
          canManage ? (
            <Link href={`/projects/${data.id}/edit`}>
              <Button variant="secondary">
                <Pencil className="h-4 w-4" aria-hidden="true" />
                {t("projects.edit")}
              </Button>
            </Link>
          ) : (
            <Link href="/projects">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("common.back")}
              </Button>
            </Link>
          )
        }
      />

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-forest">{t("projects.status")}</h2>
          <ProjectStatusBadge status={data.status} />
        </div>
        <dl>
          <Row label={t("projects.farmer")} value={data.farmer} />
          <Row label={t("projects.supervisor")} value={data.supervisor} />
          <Row label={t("projects.landDetails")} value={data.land_details} />
          <Row label={t("projects.landArea")} value={`${data.land_area} ${t("projects.hectares")}`} />
          <Row label={t("projects.cropType")} value={data.crop_type} />
          <Row
            label={t("projects.projectBudget")}
            value={formatMoney(data.project_budget)}
          />
          <Row
            label={t("projects.subsidyAmount")}
            value={formatMoney(data.subsidy_amount)}
          />
          <Row
            label={t("projects.loanAmount")}
            value={formatMoney(data.loan_amount)}
          />
          <Row label={t("projects.startDate")} value={formatDate(data.start_date)} />
          <Row
            label={t("projects.estimatedCompletionDate")}
            value={formatDate(data.estimated_completion_date)}
          />
          <Row label={t("common.latitude")} value={data.latitude ?? "—"} />
          <Row label={t("common.longitude")} value={data.longitude ?? "—"} />
        </dl>
      </Card>
    </div>
  );
}
