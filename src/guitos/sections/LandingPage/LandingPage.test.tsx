import { BudgetMother } from "@guitos/domain/budget.mother";
import { LandingPage } from "@guitos/sections/LandingPage/LandingPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { setBudgetMock } from "../../../setupTests";

describe("LandingPage", () => {
  const comp = <LandingPage loadingFromDB={false} showLandingPage={true} />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByLabelText("new budget")).toBeInTheDocument();
    expect(screen.getByLabelText("import budget")).toBeInTheDocument();
    expect(
      screen.getByLabelText("open instructions in new tab"),
    ).toBeInTheDocument();
  });

  it("triggers new budget", async () => {
    render(comp);
    setBudgetMock.mockClear();
    const newButton = screen.getAllByRole("button", { name: "new budget" })[0];
    await userEvent.click(newButton);
  });

  it("triggers upload", async () => {
    render(comp);
    const uploadEl = screen.getByTestId("import-form-control-landing-page");
    await userEvent.upload(
      uploadEl,
      new File([JSON.stringify(BudgetMother.testBudget())], "test"),
    );
    expect((uploadEl as HTMLInputElement).files).toHaveLength(1);
  });

  it("opens instructions in new tab", async () => {
    render(comp);
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
    render(<LandingPage loadingFromDB={true} showLandingPage={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
