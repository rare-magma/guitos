import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { budgetsDB, calcHistDB, optionsDB } from "./db";
import {
  budgetContextSpy,
  testBudget,
  testEmptyBudgetContext,
} from "./setupTests";

describe("App", () => {
  const comp = <App />;

  it("renders initial state", async () => {
    cleanup();
    budgetContextSpy.mockReturnValue(testEmptyBudgetContext);
    render(comp);
    expect(screen.getAllByText("guitos")[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        "Figure out where your money went, plan ahead of time and analyze past expenditures.",
      ),
    ).toBeInTheDocument();
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
    expect(optionsDB.config("name")).toBe("guitos");
    expect(optionsDB.config("storeName")).toBe("options");
    expect(calcHistDB.config("name")).toBe("guitos");
    expect(calcHistDB.config("storeName")).toBe("calcHistDB");
    await expect(budgetsDB.getItem(testBudget.id)).resolves.toBeNull();
  });

  it("shows new budget when clicking new button", async () => {
    render(comp);
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
    expect(screen.getByLabelText("clone budget")).toBeInTheDocument();
    expect(await screen.findByText("Statistics")).toBeInTheDocument();
    expect(await screen.findByText("Revenue")).toBeInTheDocument();
    expect(await screen.findByText("Expenses")).toBeInTheDocument();
    await expect(budgetsDB.getItem(testBudget.id)).resolves.toEqual(testBudget);
  });

  it("deletes budget when clicking delete button", async () => {
    render(comp);
    await act(async () => {
      await expect(budgetsDB.getItem(testBudget.id)).resolves.toEqual(
        testBudget,
      );
    });

    await waitFor(async () => {
      const newButton = screen.getAllByRole("button", { name: "new budget" });
      await userEvent.click(newButton[0]);
      await screen
        .findAllByRole("button", {
          name: "delete budget",
        })
        .then((e) => userEvent.click(e[0]));

      await userEvent.click(
        screen.getByRole("button", { name: /confirm budget deletion/i }),
      );
    });

    await act(async () => {
      await expect(budgetsDB.getItem(testBudget.id)).resolves.toBeNull();
    });
  });
});
