import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import { StatCard } from "@guitos/application/react/sections/StatCard/StatCard";
import { setBudgetMock } from "@guitos/application/react/setupTests";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { UserPreferencesResponseMother } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse.mother";
import { QueryBusMock } from "@shared/__mocks__/queryBus.mock";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("StatCard", () => {
  const onShowGraphs = vi.fn();
  const queryBus = new QueryBusMock();
  queryBus.whenAskThenReturn(UserPreferencesResponseMother.default());
  const comp = (
    <ConfigProvider queryBus={queryBus}>
      <StatCard onShowGraphs={onShowGraphs} />
    </ConfigProvider>
  );

  it("matches snapshot", () => {
    render(comp);
    waitFor(() => {
      expect(comp).toMatchSnapshot();
    });
  });

  it("renders initial state", () => {
    render(comp);
    waitFor(() => {
      expect(screen.getByText("Statistics")).toBeInTheDocument();
      expect(screen.getByDisplayValue("$90")).toBeInTheDocument();
      expect(screen.getByDisplayValue("$80")).toBeInTheDocument();
      expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    });
  });

  it("triggers onChange when user changes input", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.type(screen.getByLabelText("reserves"), "2");

    waitFor(() => {
      expect(setBudgetMock).toHaveBeenCalledWith(
        {
          ...BudgetMother.testBudget(),
          stats: { ...BudgetMother.testBudget().stats, reserves: 2 },
        },
        false,
      );
      expect(screen.getByDisplayValue("$2")).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByTestId("goal-input"));
    await userEvent.type(screen.getByTestId("goal-input"), "95");
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        stats: {
          ...BudgetMother.testBudget().stats,
          goal: 95,
          saved: 95,
          withGoal: -5,
        },
      },
      false,
    );

    expect(screen.getByDisplayValue("95")).toBeInTheDocument();
  });

  it("triggers onAutoGoal when user clicks button", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.click(
      screen.getByRole("button", { name: "calculate savings goal" }),
    );
    waitFor(() => {
      expect(setBudgetMock).toHaveBeenCalledWith(
        {
          ...BudgetMother.testBudget(),
          stats: {
            ...BudgetMother.testBudget().stats,
            goal: 90,
            saved: 90,
            withGoal: 0,
          },
        },
        true,
      );
    });
  });

  it("triggers onShowGraphs when user clicks button", async () => {
    render(comp);

    await userEvent.click(
      screen.getByRole("button", { name: "open charts view" }),
    );

    waitFor(() => {
      expect(onShowGraphs).toHaveBeenCalledTimes(1);
    });
  });
});
