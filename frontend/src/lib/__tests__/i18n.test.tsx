import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { I18nProvider, useI18n } from "@/lib/i18n";

function Probe() {
  const { t, lang, setLang } = useI18n();
  return (
    <div>
      <span data-testid="label">{t("nav.dashboard")}</span>
      <span data-testid="lang">{lang}</span>
      <span data-testid="missing">{t("does.not.exist")}</span>
      <button type="button" onClick={() => setLang("hi")}>
        switch
      </button>
    </div>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("I18nProvider", () => {
  it("renders English by default and switches to Hindi", async () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(screen.getByTestId("label")).toHaveTextContent("Dashboard");
    expect(screen.getByTestId("lang")).toHaveTextContent("en");

    await userEvent.click(screen.getByRole("button", { name: "switch" }));

    expect(screen.getByTestId("label")).toHaveTextContent("डैशबोर्ड");
    expect(screen.getByTestId("lang")).toHaveTextContent("hi");
    expect(window.localStorage.getItem("sj.lang")).toBe("hi");
  });

  it("falls back to the key for unknown translations", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(screen.getByTestId("missing")).toHaveTextContent(
      "does.not.exist",
    );
  });

  it("restores the stored language on mount", async () => {
    window.localStorage.setItem("sj.lang", "hi");

    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(await screen.findByText("डैशबोर्ड")).toBeInTheDocument();
  });
});
