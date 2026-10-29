import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import type {
  AttendanceStatus,
  ExpenseStatus,
  ProjectStatus,
} from "@/lib/types";

const PROJECT_TONES: Record<ProjectStatus, BadgeTone> = {
  PLANNED: "blue",
  IN_PROGRESS: "green",
  ON_HOLD: "amber",
  COMPLETED: "green",
  CANCELLED: "red",
};

const EXPENSE_TONES: Record<ExpenseStatus, BadgeTone> = {
  PENDING: "amber",
  APPROVED: "green",
  REJECTED: "red",
};

const ATTENDANCE_TONES: Record<AttendanceStatus, BadgeTone> = {
  PRESENT: "green",
  ABSENT: "red",
  HALF_DAY: "amber",
};

const EXPENSE_LABELS: Record<ExpenseStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half Day",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useI18n();
  return (
    <Badge tone={PROJECT_TONES[status]}>
      {t(`projects.status.${status}`)}
    </Badge>
  );
}

export function ExpenseStatusBadge({
  status,
  label,
}: {
  status: ExpenseStatus;
  label?: string;
}) {
  return (
    <Badge tone={EXPENSE_TONES[status]}>{label ?? EXPENSE_LABELS[status]}</Badge>
  );
}

export function AttendanceStatusBadge({
  status,
  label,
}: {
  status: AttendanceStatus;
  label?: string;
}) {
  return (
    <Badge tone={ATTENDANCE_TONES[status]}>
      {label ?? ATTENDANCE_LABELS[status]}
    </Badge>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-forest">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
