import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { budgetsDB } from "../../db";
import {
  budgetContextSpy,
  redoMock,
  setBudgetMock,
  setNotificationsMock,
  testBudget,
  testBudgetClone,
  testBudgetContext,
  undoMock,
} from "../../setupTests";
import { BudgetPage } from "./BudgetPage";

describe("BudgetPage", () => {
  const comp = <BudgetPage />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    render(comp);
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
  });

  it("responds to new budget keyboard shortcut", async () => {
    render(comp);
    await waitFor(async () => {
      await userEvent.type(screen.getByTestId("header"), "a");
    });
    expect(setBudgetMock).toHaveBeenCalled();
  });

  it("removes budget when clicking on delete budget button", async () => {
    render(comp);
    await waitFor(async () => {
      await expect(budgetsDB.getItem(testBudget.id)).resolves.toEqual(
        testBudget,
      );
      const deleteButton = screen.getAllByRole("button", {
        name: "delete budget",
      });
      await userEvent.click(deleteButton[0]);
      await userEvent.click(
        screen.getByRole("button", { name: "confirm budget deletion" }),
      );
      await expect(budgetsDB.getItem(testBudget.id)).resolves.toBeNull();
    });
  });

  it("clones budget when clicking on clone budget button", async () => {
    render(comp);
    await waitFor(async () => {
      const newButton = screen.getAllByRole("button", { name: "new budget" });
      await userEvent.click(newButton[0]);

      const cloneButton = screen.getAllByRole("button", {
        name: "clone budget",
      });
      await userEvent.click(cloneButton[0]);
      expect(setBudgetMock).toHaveBeenCalledWith(testBudgetClone, true);
    });
  });

  it("responds to clone budget keyboard shortcut", async () => {
    render(comp);
    await waitFor(async () => {
      const newButton = screen.getAllByRole("button", { name: "new budget" });
      await userEvent.click(newButton[0]);

      await userEvent.type(screen.getByTestId("header"), "c");
      expect(setBudgetMock).toHaveBeenCalledWith(testBudgetClone, true);
    });
  });

  it("responds to undo change keyboard shortcut", async () => {
    cleanup();
    budgetContextSpy.mockReturnValue({ ...testBudgetContext, canUndo: true });
    render(comp);
    await waitFor(async () => {
      await userEvent.type(screen.getByTestId("header"), "u");
      expect(undoMock).toHaveBeenCalled();
    });
  });

  it("responds to redo change keyboard shortcut", async () => {
    cleanup();
    budgetContextSpy.mockReturnValue({ ...testBudgetContext, canRedo: true });
    render(comp);
    await waitFor(async () => {
      await userEvent.type(screen.getByTestId("header"), "r");
      expect(redoMock).toHaveBeenCalled();
    });
  });

  it("responds to clear notifications keyboard shortcut", async () => {
    render(comp);
    setNotificationsMock.mockClear();
    await waitFor(async () => {
      await userEvent.type(screen.getByTestId("header"), "{Escape}");
      expect(setNotificationsMock).toHaveBeenCalledWith([]);
    });
  });

  it("responds to show graphs keyboard shortcut", async () => {
    render(comp);
    await waitFor(async () => {
      await userEvent.type(screen.getByTestId("header"), "i");
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});
