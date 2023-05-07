import "fake-indexeddb/auto";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetPage from "./BudgetPage";
import { budgetsDB, optionsDB } from "../../App";

describe("BudgetPage", () => {
  beforeEach(() => {
    render(<BudgetPage />);
  });

  it("renders initial state", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
  });

  it("sets up db correctly", async () => {
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
    expect(optionsDB.config("name")).toBe("guitos");
    expect(optionsDB.config("storeName")).toBe("options");
  });

  it("saves to db", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);

    budgetsDB.keys().then((e) => expect(e).not.toBeNull);

    await userEvent.type(screen.getByPlaceholderText("USD"), "CAD");
    await userEvent.click(screen.getByText("CAD"));

    const currencyOption = await optionsDB.getItem("currencyCode");
    expect(currencyOption).toBe("CAD");
  });
});
