import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  budgetContextSpy,
  generalContextSpy,
  setBudgetMock,
  testBudget,
  testEmptyBudgetContext,
  testGeneralContext,
} from "../../setupTests";
import { createNewBudget } from "../../utils";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  const comp = <LandingPage />;

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

  it("triggers new budget", async () => {
    setBudgetMock.mockClear();
    const newButton = screen.getAllByRole("button", { name: "new budget" })[0];
    await userEvent.click(newButton);
    expect(setBudgetMock).toHaveBeenCalledWith(createNewBudget(), true);
  });

  it("triggers upload", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control-landing-page"),
      new File([JSON.stringify(testBudget)], "test"),
    );
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
    generalContextSpy.mockReturnValue({
      ...testGeneralContext,
      loadingFromDB: true,
    });
    render(<LandingPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
