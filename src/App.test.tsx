import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { budgetsDB, optionsDB } from "./context/db";
import { budgetContextSpy, testEmptyBudgetContext } from "./setupTests";

describe("App", () => {
  const comp = <App />;

  beforeEach(() => {
    render(comp);
  });

  it("renders initial state", () => {
    cleanup();
    budgetContextSpy.mockReturnValue(testEmptyBudgetContext);
    render(comp);
    expect(screen.getAllByText("guitos")[0]).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("open guitos changelog")).toBeInTheDocument();
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
    expect(optionsDB.config("name")).toBe("guitos");
    expect(optionsDB.config("storeName")).toBe("options");
  });

  it("shows new budget when clicking new button", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
    expect(screen.getByLabelText("clone budget")).toBeInTheDocument();
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it.skip("deletes budget when clicking delete button", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    await screen
      .findAllByRole("button", {
        name: "delete budget",
      })
      .then((e) => userEvent.click(e[0]));

    await userEvent.click(
      screen.getByRole("button", { name: "confirm budget deletion" }),
    );

    expect(screen.queryByLabelText("delete budget")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("clone budget")).not.toBeInTheDocument();
    expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
    expect(screen.queryByText("Expenses")).not.toBeInTheDocument();
  });
});
