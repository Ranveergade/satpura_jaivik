import { beforeEach, describe, expect, it } from "vitest";

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  loadSession,
  setSessionUser,
  setTokens,
  subscribeSession,
} from "@/lib/api/session";

beforeEach(() => {
  clearSession();
  window.sessionStorage.clear();
});

describe("session storage", () => {
  it("persists tokens and exposes them through getters", () => {
    setTokens("access-1", "refresh-1");

    expect(getAccessToken()).toBe("access-1");
    expect(getRefreshToken()).toBe("refresh-1");
    expect(window.sessionStorage.getItem("sj.access")).toBe("access-1");
    expect(window.sessionStorage.getItem("sj.refresh")).toBe("refresh-1");
  });

  it("loads a stored user with a valid role", () => {
    setSessionUser({ username: "admin", role: "ADMINISTRATOR" });

    expect(getSessionUser()).toEqual({
      username: "admin",
      role: "ADMINISTRATOR",
    });
    expect(loadSession().user?.username).toBe("admin");
  });

  it("ignores malformed or unknown-role users", () => {
    window.sessionStorage.setItem("sj.user", "{not json");
    expect(loadSession().user).toBeNull();

    window.sessionStorage.setItem(
      "sj.user",
      JSON.stringify({ username: "x", role: "SUPERUSER" }),
    );
    expect(loadSession().user).toBeNull();
  });

  it("clears every stored key", () => {
    setTokens("access-1", "refresh-1");
    setSessionUser({ username: "admin", role: "ADMINISTRATOR" });

    clearSession();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(getSessionUser()).toBeNull();
    expect(window.sessionStorage.length).toBe(0);
  });

  it("notifies subscribers when the session is cleared", () => {
    let notified = 0;
    const unsubscribe = subscribeSession(() => {
      notified += 1;
    });

    setTokens("access-1", "refresh-1");
    clearSession();
    clearSession();

    expect(notified).toBe(2);
    unsubscribe();
    clearSession();
    expect(notified).toBe(2);
  });
});
