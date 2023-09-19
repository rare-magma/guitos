import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  budgetContextSpy,
  testBudget,
  testEmptyBudgetContext,
} from "../../setupTests";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
  const inputRefMock: { current: HTMLInputElement | null } = { current: null };
  const onNew = vi.fn();
  const onImport = vi.fn();
  const comp = (
    <LandingPage
      loading={false}
      inputRef={inputRefMock}
      onNew={onNew}
      onImport={onImport}
    />
  );

  beforeEach(() => {
    budgetContextSpy.mockReturnValue(testEmptyBudgetContext);
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByLabelText("new budget")).toBeInTheDocument();
    expect(screen.getByLabelText("import budget")).toBeInTheDocument();
    expect(
      screen.getByLabelText("open instructions in new tab"),
    ).toBeInTheDocument();
  });

  it("triggers onNew", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" })[0];
    await userEvent.click(newButton);
    expect(onNew).toBeCalledTimes(1);
  });

  it("triggers onImport", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control-landing-page"),
      testBudget as unknown as File,
    );
    expect(onImport).toBeCalledTimes(1);
  });

  it("opens instructions in new tab", async () => {
    const instructionsButton = screen.getByLabelText(
      "open instructions in new tab",
    );
    await userEvent.click(instructionsButton);
    expect(instructionsButton).toHaveAttribute(
      "href",
      "https://github.com/rare-magma/guitos#getting-started",
    );
  });

  it("renders loading spinner", () => {
    render(
      <LandingPage
        loading={true}
        inputRef={inputRefMock}
        onNew={onNew}
        onImport={onImport}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
