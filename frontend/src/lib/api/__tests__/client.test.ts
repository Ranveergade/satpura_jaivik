import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "@/lib/api/client";
import { NetworkError } from "@/lib/api/errors";import {
  clearSession,
  getAccessToken,
  setTokens,
  subscribeSession,
} from "@/lib/api/session";

type FakeResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
};

function jsonResponse(status: number, body: unknown): FakeResponse {
  const text = JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => text,
    json: async () => body,
  };
}

function asResponse(response: FakeResponse): Response {
  return response as unknown as Response;
}

function rawTextResponse(status: number, text: string): FakeResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => text,
    json: async () => {
      throw new Error("No JSON body");
    },
  };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  clearSession();
  document.cookie = "csrftoken=test-token";
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

describe("apiFetch", () => {
  it("returns parsed JSON for a successful request", async () => {
    fetchMock.mockResolvedValueOnce(
      asResponse(jsonResponse(200, { projects: [1, 2] })),
    );

    const data = await apiFetch<{ projects: number[] }>("/api/projects/");

    expect(data).toEqual({ projects: [1, 2] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/backend/api/projects/");
    expect(init.method).toBe("GET");
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("attaches the bearer token when one is stored", async () => {
    setTokens("access-token", "refresh-token");
    fetchMock.mockResolvedValueOnce(asResponse(jsonResponse(200, [])));

    await apiFetch("/api/expenses/");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer access-token",
    );
  });

  it("maps a 400 response to ApiError with field errors", async () => {
    fetchMock.mockResolvedValueOnce(
      asResponse(
        jsonResponse(400, {
          farmer_id: ["Select a valid farmer."],
          land_area: ["Must be positive."],
        }),
      ),
    );

    await expect(
      apiFetch("/api/projects/create/", { method: "POST", body: {} }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      fieldErrors: {
        farmer_id: ["Select a valid farmer."],
        land_area: ["Must be positive."],
      },
    });
  });

  it("maps 403 and 500 responses to server error text", async () => {
    fetchMock
      .mockResolvedValueOnce(asResponse(jsonResponse(403, {})))
      .mockResolvedValueOnce(
        asResponse(rawTextResponse(500, "Internal Server Error")),
      );

    await expect(apiFetch("/api/audit-logs/")).rejects.toMatchObject({
      status: 403,
      message: "You do not have permission to do that.",
    });
    await expect(apiFetch("/api/audit-logs/")).rejects.toMatchObject({
      status: 500,
      message: "The server encountered an error.",
    });
  });

  it("does not attempt a refresh on 401 without a token", async () => {
    fetchMock.mockResolvedValueOnce(asResponse(jsonResponse(401, {})));

    await expect(apiFetch("/api/projects/")).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears the session and notifies listeners when refresh fails", async () => {
    setTokens("expired", "dead-refresh");
    let notified = 0;
    const unsubscribe = subscribeSession(() => {
      notified += 1;
    });
    fetchMock
      .mockResolvedValueOnce(asResponse(jsonResponse(401, {})))
      .mockResolvedValueOnce(asResponse(jsonResponse(401, {})));

    await expect(apiFetch("/api/projects/")).rejects.toMatchObject({
      status: 401,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBeNull();
    expect(notified).toBe(1);
    unsubscribe();
  });

  it("refreshes once and retries the original request on 401", async () => {
    setTokens("old-access", "refresh-1");
    fetchMock
      .mockResolvedValueOnce(asResponse(jsonResponse(401, {})))
      .mockResolvedValueOnce(
        asResponse(jsonResponse(200, { access: "new-access" })),
      )
      .mockResolvedValueOnce(asResponse(jsonResponse(200, { id: 7 })));

    const data = await apiFetch<{ id: number }>("/api/projects/7/");

    expect(data).toEqual({ id: 7 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toBe(
      "/backend/api/token/refresh/",
    );
    expect(getAccessToken()).toBe("new-access");
  });

  it("single-flights concurrent refreshes", async () => {
    setTokens("expired", "refresh-2");
    const attempts = new Map<string, number>();
    let refreshCalls = 0;

    fetchMock.mockImplementation(async (input: string) => {
      const url = String(input);
      if (url.includes("/api/token/refresh/")) {
        refreshCalls += 1;
        return asResponse(jsonResponse(200, { access: "fresh" }));
      }
      const seen = attempts.get(url) ?? 0;
      attempts.set(url, seen + 1);
      if (seen === 0) {
        return asResponse(jsonResponse(401, {}));
      }
      return asResponse(jsonResponse(200, { url }));
    });

    const [first, second] = await Promise.all([
      apiFetch<{ url: string }>("/api/projects/"),
      apiFetch<{ url: string }>("/api/expenses/"),
    ]);

    expect(refreshCalls).toBe(1);
    expect(first.url).toContain("/api/projects/");
    expect(second.url).toContain("/api/expenses/");
  });

  it("wraps transport failures in NetworkError", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(apiFetch("/api/projects/")).rejects.toBeInstanceOf(
      NetworkError,
    );
  });

  it("reports timeouts as NetworkError", async () => {
    fetchMock.mockRejectedValueOnce(
      new DOMException("The operation was aborted.", "AbortError"),
    );

    await expect(apiFetch("/api/projects/")).rejects.toThrow(
      "The request timed out.",
    );
  });
});
