import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AuthProvider } from "@/lib/auth";
import { RoleGuard } from "@/components/AuthGate";
import {
  clearSession,
  setSessionUser,
  setTokens,
} from "@/lib/api/session";

beforeEach(() => {
  clearSession();
  window.sessionStorage.clear();
});

describe("RoleGuard", () => {
  it("renders children for an allowed role", async () => {
    setTokens("access", "refresh");
    setSessionUser({ username: "admin", role: "ADMINISTRATOR" });

    render(
      <AuthProvider>
        <RoleGuard roles={["ADMINISTRATOR"]}>
          <p>protected content</p>
        </RoleGuard>
      </AuthProvider>,
    );

    expect(await screen.findByText("protected content")).toBeInTheDocument();
  });

  it("shows a permission error for a disallowed role", async () => {
    setTokens("access", "refresh");
    setSessionUser({ username: "farmer", role: "FARMER" });

    render(
      <AuthProvider>
        <RoleGuard roles={["ADMINISTRATOR"]}>
          <p>protected content</p>
        </RoleGuard>
      </AuthProvider>,
    );

    expect(
      await screen.findByText(
        "You do not have permission to view this page.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });
});
