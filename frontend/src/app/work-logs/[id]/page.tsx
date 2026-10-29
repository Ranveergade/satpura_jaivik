"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { AuthGate } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import { Alert, Button, Card, Spinner } from "@/components/ui";
import { fetchWorkLog } from "@/lib/api/projects";
import { useApiResource } from "@/lib/useApiResource";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";

export default function WorkLogDetailPage() {
  return (
    <AuthGate>
      <WorkLogDetailContent />
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

function WorkLogDetailContent() {
  const params = useParams<{ id: string }>();
  const logId = Number(params.id);
  const { t } = useI18n();
  const { data, loading, error, reload } = useApiResource(
    () => fetchWorkLog(logId),
    [logId],
  );

  if (loading) return <Spinner label={t("common.loading")} />;

  if (error || !data) {
    return (
      <div className="flex flex-col gap-3">
        <Alert tone="error">{error ?? t("common.error")}</Alert>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
          <Link href="/work-logs">
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
        title={`${t("worklogs.workLog")} #${data.id}`}
        subtitle={`Project #${data.project} · ${formatDate(data.work_date)}`}
        actions={
          <Link href="/work-logs">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("common.back")}
            </Button>
          </Link>
        }
      />

      <Card>
        <dl>
          <Row label={t("worklogs.supervisor")} value={data.supervisor} />
          <Row label={t("worklogs.workDate")} value={formatDate(data.work_date)} />
          <Row
            label={t("worklogs.laborersPresent")}
            value={String(data.laborers_present)}
          />
          <Row label={t("worklogs.activities")} value={data.activities} />
          <Row
            label={t("worklogs.observations")}
            value={data.observations || "—"}
          />
          <Row
            label={t("worklogs.checkInLatitude")}
            value={data.check_in_latitude ?? "—"}
          />
          <Row
            label={t("worklogs.checkInLongitude")}
            value={data.check_in_longitude ?? "—"}
          />
        </dl>
      </Card>
    </div>
  );
}
