import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import TableCard from "@guitos/application/react/sections/TableCard/TableCard";
import { setBudgetMock } from "@guitos/application/react/setupTests";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { UserPreferencesResponseMother } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse.mother";
import { QueryBusMock } from "@shared/__mocks__/queryBus.mock";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("TableCard", () => {
  const queryBus = new QueryBusMock();
  queryBus.whenAskThenReturn(UserPreferencesResponseMother.default());
  const comp = (
    <ConfigProvider queryBus={queryBus}>
      <TableCard header={"Expenses"} />
    </ConfigProvider>
  );

  it("matches snapshot", () => {
    waitFor(() => {
      render(comp);
      expect(comp).toMatchSnapshot();
    });
  });

  it("renders initial Expenses state", () => {
    render(comp);
    waitFor(async () => {
      expect(await screen.findByDisplayValue("expense1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
    });
  });

  it("renders initial Revenue state", () => {
    render(
      <ConfigProvider queryBus={queryBus}>
        <TableCard header={"Revenue"} />
      </ConfigProvider>,
    );
    waitFor(async () => {
      expect(await screen.findByDisplayValue("income1")).toBeInTheDocument();
      expect(await screen.findByDisplayValue("$100")).toBeInTheDocument();
    });
  });

  it("responds when user changes input", async () => {
    render(comp);
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");
    waitFor(() => {
      expect(
        screen.getByDisplayValue("expense1change name"),
      ).toBeInTheDocument();

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
    });

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
    waitFor(() => {
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
  });

  it("adds new Revenue when user clicks adds new item button", async () => {
    cleanup();
    render(
      <ConfigProvider queryBus={queryBus}>
        <TableCard header={"Revenue"} />
      </ConfigProvider>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Revenue" }),
    );
    waitFor(() => {
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
  });

  it("removes item when user clicks delete item button", async () => {
    render(comp);
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    waitFor(async () => {
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
});
