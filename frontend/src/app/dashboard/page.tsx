"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Receipt,
  ScrollText,
  Sprout,
  NotebookPen,
  Clock3,
} from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { hasRole, AUDIT_VIEWERS, WORK_LOG_NAV } from "@/lib/roles";
import { fetchProjects, fetchWorkLogs } from "@/lib/api/projects";
import { fetchExpenses } from "@/lib/api/expenses";
import { fetchAttendance } from "@/lib/api/attendance";
import { fetchAuditLogs } from "@/lib/api/auditlogs";
import type {
  Attendance,
  AuditLog,
  Expense,
  ProjectListItem,
  WorkLog,
} from "@/lib/types";

type DashboardData = {
  projects: ProjectListItem[];
  expenses: Expense[];
  workLogs: WorkLog[];
  attendance: Attendance[];
  auditLogs: AuditLog[];
};

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardContent />
    </AuthGate>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const projects = await fetchProjects();
        const expenses = await fetchExpenses();
        const workLogs = hasRole(user.role, WORK_LOG_NAV)
          ? await fetchWorkLogs()
          : [];
        const attendance = hasRole(user.role, WORK_LOG_NAV)
          ? await fetchAttendance()
          : [];
        const auditLogs = hasRole(user.role, AUDIT_VIEWERS)
          ? (await fetchAuditLogs(1)).results
          : [];
        if (!cancelled) {
          setData({ projects, expenses, workLogs, attendance, auditLogs });
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : t("common.error"),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, reloadKey, t]);

  const counts = data
    ? {
        projects: data.projects.length,
        workLogs: data.workLogs.length,
        attendance: data.attendance.length,
        expenses: data.expenses.length,
        pendingReviews: data.expenses.filter((item) => item.status === "PENDING")
          .length,
        auditLogs: data.auditLogs.length,
      }
    : null;

  const cards = [
    {
      key: "projects",
      href: "/projects",
      label: t("dashboard.statProjects"),
      value: counts?.projects,
      icon: Sprout,
    },
    ...(hasRole(user?.role ?? null, WORK_LOG_NAV)
      ? [
          {
            key: "workLogs",
            href: "/work-logs",
            label: t("dashboard.statWorkLogs"),
            value: counts?.workLogs,
            icon: NotebookPen,
          },
          {
            key: "attendance",
            href: "/attendance",
            label: t("dashboard.statAttendance"),
            value: counts?.attendance,
            icon: CalendarCheck,
          },
        ]
      : []),
    {
      key: "expenses",
      href: "/expenses",
      label: t("dashboard.statExpenses"),
      value: counts?.expenses,
      icon: Receipt,
    },
    {
      key: "pending",
      href: "/expenses",
      label: t("dashboard.statPendingReviews"),
      value: counts?.pendingReviews,
      icon: Clock3,
    },
    ...(hasRole(user?.role ?? null, AUDIT_VIEWERS)
      ? [
          {
            key: "audit",
            href: "/audit-logs",
            label: t("dashboard.statAuditLogs"),
            value: counts?.auditLogs,
            icon: ScrollText,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-forest">
          {t("dashboard.title")}
        </h1>
        <p className="mt-1 text-sm text-secondary">
          {t("dashboard.welcome")}, {user?.username}
        </p>
      </div>

      {error ? (
        <div className="flex flex-col gap-3">
          <Alert tone="error">{error}</Alert>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              {t("common.retry")}
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? <Spinner label={t("common.loading")} /> : null}

      {!loading && !error && counts ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => router.push(card.href)}
                className="flex flex-col gap-2 rounded-xl border border-secondary/20 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-2xl font-bold text-ink">
                  {card.value ?? 0}
                </span>
                <span className="text-xs font-medium text-secondary">
                  {card.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {!loading && !error && data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-forest">
                {t("projects.title")}
              </h2>
              <Badge tone="green">{data.projects.length}</Badge>
            </div>
            {data.projects.length === 0 ? (
              <EmptyState title={t("common.empty")} />
            ) : (
              <ul className="divide-y divide-secondary/15">
                {data.projects.slice(0, 5).map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-2 py-2 text-sm"
                  >
                    <span className="font-medium text-ink">
                      #{project.id} · {project.crop_type}
                    </span>
                    <span className="text-secondary">{project.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-forest">
                {t("expenses.title")}
              </h2>
              <Badge tone="amber">
                {counts?.pendingReviews ?? 0} {t("dashboard.pending")}
              </Badge>
            </div>
            {data.expenses.length === 0 ? (
              <EmptyState title={t("common.empty")} />
            ) : (
              <ul className="divide-y divide-secondary/15">
                {data.expenses.slice(0, 5).map((expense) => (
                  <li
                    key={expense.id}
                    className="flex items-center justify-between gap-2 py-2 text-sm"
                  >
                    <span className="font-medium text-ink">
                      ₹{expense.amount} ·{" "}
                      {t(`expenses.category.${expense.category}`)}
                    </span>
                    <Badge
                      tone={
                        expense.status === "PENDING"
                          ? "amber"
                          : expense.status === "APPROVED"
                            ? "green"
                            : "red"
                      }
                    >
                      {t(
                        expense.status === "PENDING"
                          ? "expenses.statusPending"
                          : expense.status === "APPROVED"
                            ? "expenses.statusApproved"
                            : "expenses.statusRejected",
                      )}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
