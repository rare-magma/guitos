import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetPage from "./BudgetPage";

describe("BudgetPage", () => {
  beforeEach(() => {
    render(<BudgetPage />);
  });

  it("renders initial state", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
  });
});
