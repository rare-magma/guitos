import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  budgetContextSpy,
  redoMock,
  setBudgetMock,
  testBudgetContext,
  undoMock,
} from "../../../setupTests";
import { BudgetMother } from "../../domain/budget.mother";
import { localForageBudgetRepository } from "../../infrastructure/localForageBudgetRepository";
import { BudgetPage } from "./BudgetPage";

const budgetRepository = new localForageBudgetRepository();

describe("BudgetPage", () => {
  const setNotificationsMock = vi.fn();
  const comp = <BudgetPage />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    render(comp);
    const newButton = await screen.findAllByRole("button", {
      name: "new budget",
    });
    await act(async () => {
      await userEvent.click(newButton[0]);
    });
    expect(screen.getByLabelText("delete budget")).toBeVisible();
  });

  it("responds to new budget keyboard shortcut", async () => {
    render(comp);
    await userEvent.type(await screen.findByTestId("header"), "a");
    expect(setBudgetMock).toHaveBeenCalled();
  });

  it("removes budget when clicking on delete budget button", async () => {
    render(comp);
    const deleteButton = await screen.findAllByRole("button", {
      name: "delete budget",
    });
    await userEvent.click(deleteButton[0]);
    await userEvent.click(
      await screen.findByRole("button", { name: "confirm budget deletion" }),
    );
    await expect(
      budgetRepository.get(BudgetMother.testBudget().id),
    ).rejects.toThrow();
  });

  it.skip("clones budget when clicking on clone budget button", async () => {
    render(comp);
    const newButton = await screen.findAllByRole("button", {
      name: "new budget",
    });
    await userEvent.click(newButton[0]);

    const cloneButton = screen.getAllByRole("button", {
      name: "clone budget",
    });
    await userEvent.click(cloneButton[0]);
    expect(setBudgetMock).toHaveBeenCalledWith(
      BudgetMother.testBudgetClone(),
      true,
    );
  });

  it.skip("responds to clone budget keyboard shortcut", async () => {
    render(comp);
    const newButton = await screen.findAllByRole("button", {
      name: "new budget",
    });
    await userEvent.click(newButton[0]);

    await userEvent.type(await screen.findByTestId("header"), "c");
    expect(setBudgetMock).toHaveBeenCalledWith(
      BudgetMother.testBudgetClone(),
      true,
    );
  });

  it("responds to undo change keyboard shortcut", async () => {
    cleanup();
    budgetContextSpy.mockReturnValue({ ...testBudgetContext, canUndo: true });
    render(comp);
    await userEvent.type(await screen.findByTestId("header"), "u");
    expect(undoMock).toHaveBeenCalled();
  });

  it("responds to redo change keyboard shortcut", async () => {
    cleanup();
    budgetContextSpy.mockReturnValue({ ...testBudgetContext, canRedo: true });
    render(comp);
    await userEvent.type(await screen.findByTestId("header"), "r");
    expect(redoMock).toHaveBeenCalled();
  });

  it.skip("responds to clear notifications keyboard shortcut", async () => {
    render(comp);
    setNotificationsMock.mockClear();
    await userEvent.type(await screen.findByTestId("header"), "{Escape}");
    expect(setNotificationsMock).toHaveBeenCalledWith([]);
  });

  it("responds to show graphs keyboard shortcut", async () => {
    render(comp);
    await userEvent.type(await screen.findByTestId("header"), "i");
    for (const element of screen.getAllByRole("status")) {
      expect(element).toBeVisible();
    }
  });
});
