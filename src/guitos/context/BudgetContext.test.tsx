import { BudgetProvider, useBudget } from "@guitos/context/BudgetContext";
import { BudgetMother } from "@guitos/domain/budget.mother";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestComponent() {
  const { budget, budgetList } = useBudget();
  return (
    <>
      <p data-testid="budget">{JSON.stringify(budget)}</p>
      <p data-testid="budgetList">{JSON.stringify(budgetList)}</p>
    </>
  );
}

describe("BudgetProvider", () => {
  it("provides expected BudgetContext obj to child elements", () => {
    render(
      <BudgetProvider>
        <TestComponent />
      </BudgetProvider>,
    );
    expect(screen.getByTestId("budget").textContent).toEqual(
      JSON.stringify(BudgetMother.testBudget()),
    );
    expect(screen.getByTestId("budgetList").textContent).toEqual(
      JSON.stringify(BudgetMother.testBudgetList()),
    );
  });
});
