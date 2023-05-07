import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { testBudget } from "../../setupTests";

describe("LandingPage", () => {
  const inputRefMock: { current: HTMLInputElement | null } = { current: null };
  const onNew = vi.fn();
  const onImport = vi.fn();

  beforeEach(() => {
    render(
      <LandingPage
        loading={false}
        budget={null}
        budgetList={[]}
        inputRef={inputRefMock}
        onNew={onNew}
        onImport={onImport}
      />
    );
  });

  it("renders initial state", async () => {
    expect(
      screen.getAllByRole("button", { name: "new budget" })[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "import budget" })[0]
    ).toBeInTheDocument();
  });

  it("triggers onNew", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" })[0];
    await userEvent.click(newButton);
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("triggers onImport", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control-landing-page"),
      testBudget as unknown as File
    );
    expect(onImport).toHaveBeenCalledTimes(1);
  });

  it("renders loading spinner", async () => {
    render(
      <LandingPage
        loading={true}
        budget={null}
        budgetList={[]}
        inputRef={inputRefMock}
        onNew={onNew}
        onImport={onImport}
      />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
