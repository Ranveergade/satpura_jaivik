import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProjectForm } from "@/components/ProjectForm";
import { I18nProvider } from "@/lib/i18n";

function renderForm(
  overrides: Partial<React.ComponentProps<typeof ProjectForm>> = {},
) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <I18nProvider>
      <ProjectForm
        mode="create"
        submitting={false}
        serverError={null}
        fieldErrors={{}}
        onSubmit={onSubmit}
        onCancel={onCancel}
        {...overrides}
      />
    </I18nProvider>,
  );
  return { onSubmit, onCancel };
}

describe("ProjectForm", () => {
  it("blocks submission and shows required errors when empty", async () => {
    const { onSubmit } = renderForm();

    await userEvent.click(
      screen.getByRole("button", { name: /create project/i }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText("This field is required.").length).toBeGreaterThan(
      0,
    );
  });

  it("shows the server error and the first field error", () => {
    renderForm({
      serverError: "The request was invalid.",
      fieldErrors: { land_details: ["Land details are required."] },
    });

    expect(screen.getByText("The request was invalid.")).toBeInTheDocument();
    expect(screen.getByText("Land details are required.")).toBeInTheDocument();
  });

  it("does not render writable farmer fields in edit mode", () => {
    renderForm({
      mode: "edit",
      initial: {
        land_details: "Survey 12",
        land_area: "2.5",
        crop_type: "Soybean",
        project_budget: "10000",
        start_date: "2026-01-01",
        estimated_completion_date: "2026-06-01",
      },
    });

    expect(
      screen.getByText(/farmer and supervisor cannot be changed/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Farmer (account ID)")).not.toBeInTheDocument();
  });
});
