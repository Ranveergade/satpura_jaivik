import { describe, expect, it } from "vitest";

import {
  AUDIT_VIEWERS,
  EXPENSE_REVIEWERS,
  EXPENSE_SUBMITTERS,
  PROJECT_MANAGERS,
  WORK_LOG_NAV,
  hasRole,
} from "@/lib/roles";
import type { Role } from "@/lib/types";

describe("hasRole", () => {
  it("rejects a missing session role", () => {
    expect(hasRole(null, PROJECT_MANAGERS)).toBe(false);
  });

  it("matches allowed roles only", () => {
    expect(hasRole("ADMINISTRATOR", PROJECT_MANAGERS)).toBe(true);
    expect(hasRole("FARMER", PROJECT_MANAGERS)).toBe(false);
  });

  it("keeps privileged areas restricted", () => {
    const supervisors: Role = "SUPERVISOR";
    expect(hasRole(supervisors, EXPENSE_SUBMITTERS)).toBe(true);
    expect(hasRole(supervisors, EXPENSE_REVIEWERS)).toBe(false);
    expect(hasRole(supervisors, AUDIT_VIEWERS)).toBe(false);
    expect(hasRole(supervisors, WORK_LOG_NAV)).toBe(true);
  });
});
