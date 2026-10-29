import { describe, expect, it } from "vitest";

import {
  ApiError,
  NetworkError,
  extractMessage,
  statusFallback,
} from "@/lib/api/errors";

describe("extractMessage", () => {
  it("prefers explicit error and detail fields", () => {
    expect(extractMessage({ error: "No access" }, "fallback")).toBe("No access");
    expect(extractMessage({ detail: "Expired" }, "fallback")).toBe("Expired");
    expect(extractMessage(["first", "second"], "fallback")).toBe("fallback");
    expect(extractMessage({ detail: ["first", "second"] }, "fallback")).toBe(
      "first",
    );
  });

  it("handles plain text bodies and falls back for unknown shapes", () => {
    expect(extractMessage("Plain text", "fallback")).toBe("Plain text");
    expect(extractMessage(null, "fallback")).toBe("fallback");
    expect(extractMessage({}, "fallback")).toBe("fallback");
    expect(extractMessage({ non_field_errors: ["Nope"] }, "fallback")).toBe(
      "Nope",
    );
  });
});

describe("statusFallback", () => {
  it("provides user-facing text for common statuses", () => {
    expect(statusFallback(400)).toBe("The request was invalid.");
    expect(statusFallback(401)).toBe("Please sign in again.");
    expect(statusFallback(403)).toBe(
      "You do not have permission to do that.",
    );
    expect(statusFallback(404)).toBe("The requested record was not found.");
    expect(statusFallback(409)).toBe("This record already exists.");
    expect(statusFallback(503)).toBe(
      "The service is temporarily unavailable.",
    );
    expect(statusFallback(500)).toBe("The server encountered an error.");
    expect(statusFallback(418)).toBe("Request failed (418).");
  });
});

describe("ApiError", () => {
  it("extracts nested field errors from DRF responses", () => {
    const error = new ApiError(
      400,
      { amount: ["Required"], project: ["Invalid"], status: "bad" },
      "Invalid",
    );

    expect(error.fieldErrors).toEqual({
      amount: ["Required"],
      project: ["Invalid"],
      status: ["bad"],
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
  });

  it("ignores non-object bodies", () => {
    expect(new ApiError(500, "boom", "boom").fieldErrors).toEqual({});
    expect(new NetworkError().message).toBe("Network request failed.");
  });
});
