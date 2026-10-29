"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AuthGate, RoleGuard } from "@/components/AuthGate";
import { PageHeader } from "@/components/PageHeader";
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { fetchProjects, createWorkLog } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/errors";
import { useApiResource } from "@/lib/useApiResource";

const SUPERVISORS_ONLY = ["SUPERVISOR"] as const;

export default function NewWorkLogPage() {
  return (
    <AuthGate>
      <RoleGuard roles={[...SUPERVISORS_ONLY]}>
        <NewWorkLogContent />
      </RoleGuard>
    </AuthGate>
  );
}

function NewWorkLogContent() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: projects, loading, error, reload } =
    useApiResource(fetchProjects);

  const [project, setProject] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [activities, setActivities] = useState("");
  const [laborers, setLaborers] = useState("");
  const [observations, setObservations] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const next: Record<string, string> = {};
    if (!project) next.project = t("common.required");
    if (!workDate) next.work_date = t("common.required");
    if (!activities.trim()) next.activities = t("common.required");
    if (laborers === "" || Number(laborers) < 0) {
      next.laborers_present = "Enter zero or a positive number.";
    }
    if ((latitude && !longitude) || (!latitude && longitude)) {
      next.check_in = "Provide both coordinates or neither.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const log = await createWorkLog({
        project: Number(project),
        work_date: workDate,
        activities: activities.trim(),
        laborers_present: Number(laborers),
        observations: observations.trim(),
        check_in_latitude: latitude || null,
        check_in_longitude: longitude || null,
      });
      router.push(`/work-logs/${log.id}`);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setServerError(caught.message);
        setErrors((current) => {
          const merged = { ...current };
          for (const [key, value] of Object.entries(caught.fieldErrors)) {
            if (value.length) merged[key] = value[0];
          }
          return merged;
        });
      } else {
        setServerError(
          caught instanceof Error ? caught.message : t("common.error"),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t("worklogs.new")} />
      {loading ? <Spinner label={t("common.loading")} /> : null}
      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <Button variant="secondary" size="sm" onClick={reload}>
            {t("common.retry")}
          </Button>
        </div>
      ) : null}

      {projects ? (
        <Card>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {serverError ? <Alert tone="error">{serverError}</Alert> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("common.project")} required error={errors.project}>
                <Select
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  invalid={Boolean(errors.project)}
                >
                  <option value="">{t("assignments.selectProject")}</option>
                  {projects.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      #{item.id} · {item.crop_type}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label={t("worklogs.workDate")}
                required
                error={errors.work_date}
              >
                <Input
                  type="date"
                  value={workDate}
                  onChange={(event) => setWorkDate(event.target.value)}
                  invalid={Boolean(errors.work_date)}
                />
              </Field>
            </div>

            <Field
              label={t("worklogs.activities")}
              required
              error={errors.activities}
            >
              <Textarea
                rows={3}
                value={activities}
                onChange={(event) => setActivities(event.target.value)}
                invalid={Boolean(errors.activities)}
              />
            </Field>

            <Field
              label={t("worklogs.laborersPresent")}
              required
              error={errors.laborers_present}
            >
              <Input
                type="number"
                min="0"
                step="1"
                value={laborers}
                onChange={(event) => setLaborers(event.target.value)}
                invalid={Boolean(errors.laborers_present)}
              />
            </Field>

            <Field label={t("worklogs.observations")}>
              <Textarea
                rows={2}
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("worklogs.checkInLatitude")}>
                <Input
                  type="number"
                  step="0.000001"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  invalid={Boolean(errors.check_in)}
                />
              </Field>
              <Field label={t("worklogs.checkInLongitude")}>
                <Input
                  type="number"
                  step="0.000001"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  invalid={Boolean(errors.check_in)}
                />
              </Field>
            </div>
            {errors.check_in ? (
              <p className="text-sm text-red">{errors.check_in}</p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={submitting}>
                {t("common.save")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/work-logs")}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
