import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import TableCard from "@guitos/sections/TableCard/TableCard";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { setBudgetMock } from "../../application/react/setupTests";

describe("TableCard", () => {
  const comp = <TableCard header={"Expenses"} />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });
  it("renders initial Expenses state", async () => {
    render(comp);
    expect(await screen.findByDisplayValue("expense1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("renders initial Revenue state", async () => {
    render(<TableCard header={"Revenue"} />);
    expect(await screen.findByDisplayValue("income1")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("$100")).toBeInTheDocument();
  });

  it("responds when user changes input", async () => {
    render(comp);
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");
    expect(screen.getByDisplayValue("expense1change name")).toBeInTheDocument();

    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [{ id: 1, name: "expense1change name", value: 10 }],
          total: 10,
        },
      },
      false,
    );
    setBudgetMock.mockClear();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [{ id: 1, name: "expense1", value: 123 }],
          total: 123,
        },
        stats: {
          ...BudgetMother.testBudget().stats,
          available: -23,
          withGoal: -33,
        },
      },
      false,
    );
  });

  it("adds new Expense when user clicks adds new item button", async () => {
    render(comp);
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Expenses" }),
    );
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [
            ...BudgetMother.testBudget().expenses.items,
            { id: 2, name: "", value: 0 },
          ],
          total: 10,
        },
      },
      true,
    );
  });

  it("adds new Revenue when user clicks adds new item button", async () => {
    cleanup();
    render(<TableCard header={"Revenue"} />);
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Revenue" }),
    );
    expect(screen.getByDisplayValue("$100")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        incomes: {
          items: [
            ...BudgetMother.testBudget().incomes.items,
            { id: 3, name: "", value: 0 },
          ],
          total: 100,
        },
      },
      true,
    );
  });

  it("removes item when user clicks delete item button", async () => {
    render(comp);
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [],
          total: 0,
        },
        stats: {
          ...BudgetMother.testBudget().stats,
          available: 100,
          withGoal: 90,
        },
      },
      true,
    );
  });
});
