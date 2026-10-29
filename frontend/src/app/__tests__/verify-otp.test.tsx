import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import VerifyOtpPage from "@/app/verify-otp/page";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { clearSession } from "@/lib/api/session";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

function renderPage() {
  render(
    <I18nProvider>
      <AuthProvider>
        <VerifyOtpPage />
      </AuthProvider>
    </I18nProvider>,
  );
}

beforeEach(() => {
  clearSession();
  window.sessionStorage.removeItem("sj.challenge");
  replace.mockReset();
});

describe("VerifyOtpPage", () => {
  it("shows the OTP field for a pending challenge instead of bouncing to login", async () => {
    window.sessionStorage.setItem("sj.challenge", "42");

    renderPage();

    expect(await screen.findByRole("textbox")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalledWith("/login");
  });

  it("offers a way back to login when there is no pending challenge", async () => {
    renderPage();

    expect(
      await screen.findByText("Back to sign in"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
