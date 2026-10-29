import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime, formatMoney } from "@/lib/format";

describe("formatMoney", () => {
  it("prefixes amounts and handles empty values", () => {
    expect(formatMoney("1500.00")).toBe("₹1500.00");
    expect(formatMoney("")).toBe("—");
    expect(formatMoney(null)).toBe("—");
  });
});

describe("formatDate", () => {
  it("formats ISO dates and keeps invalid values visible", () => {
    expect(formatDate("2026-01-15")).not.toBe("—");
    expect(formatDate("not-a-date")).toBe("not-a-date");
    expect(formatDate(null)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("formats timestamps and handles missing values", () => {
    expect(formatDateTime("2026-01-15T10:30:00Z")).not.toBe("—");
    expect(formatDateTime(undefined)).toBe("—");
  });
});
