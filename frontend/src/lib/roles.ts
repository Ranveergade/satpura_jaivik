import type { Role } from "./types";

export const PROJECT_MANAGERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
];

export const PROJECT_VIEWERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "ACCOUNTS",
  "MANAGEMENT",
  "SUPERVISOR",
  "FARMER",
];

export const WORKER_MANAGERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "SUPERVISOR",
  "ACCOUNTS",
  "MANAGEMENT",
];

export const WORK_LOG_NAV: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "SUPERVISOR",
];

export const ATTENDANCE_NAV: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "SUPERVISOR",
];

export const EXPENSE_SUBMITTERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "SUPERVISOR",
];

export const EXPENSE_REVIEWERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "ACCOUNTS",
];

export const AUDIT_VIEWERS: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
];

export const FARMER_PROFILE_ROLES: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "ACCOUNTS",
  "MANAGEMENT",
  "FARMER",
];

export function hasRole(role: Role | null, allowed: Role[]): boolean {
  return role !== null && allowed.includes(role);
}

export type NavItem = {
  href: string;
  labelKey: string;
  roles: Role[];
};

const ALL_ROLES: Role[] = [
  "SUPER_ADMINISTRATOR",
  "ADMINISTRATOR",
  "ACCOUNTS",
  "SUPERVISOR",
  "FARMER",
  "MANAGEMENT",
];

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", roles: ALL_ROLES },
  { href: "/projects", labelKey: "nav.projects", roles: PROJECT_VIEWERS },
  { href: "/workers", labelKey: "nav.workers", roles: WORKER_MANAGERS },
  { href: "/assignments", labelKey: "nav.assignments", roles: WORKER_MANAGERS },
  { href: "/work-logs", labelKey: "nav.workLogs", roles: WORK_LOG_NAV },
  { href: "/attendance", labelKey: "nav.attendance", roles: ATTENDANCE_NAV },
  { href: "/expenses", labelKey: "nav.expenses", roles: ALL_ROLES },
  { href: "/audit-logs", labelKey: "nav.auditLogs", roles: AUDIT_VIEWERS },
  { href: "/farmer-profiles", labelKey: "nav.farmerProfiles", roles: FARMER_PROFILE_ROLES },
];
