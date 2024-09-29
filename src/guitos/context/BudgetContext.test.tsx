import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetMother } from "../../guitos/domain/budget.mother";
import { BudgetProvider, useBudget } from "./BudgetContext";

function TestComponent() {
  const { budget, budgetList } = useBudget();
  return (
    <>
      <p aria-label="budget">{JSON.stringify(budget)}</p>
      <p aria-label="budgetList">{JSON.stringify(budgetList)}</p>
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
    expect(screen.getByLabelText("budget").textContent).toEqual(
      JSON.stringify(BudgetMother.testBudget()),
    );
    expect(screen.getByLabelText("budgetList").textContent).toEqual(
      JSON.stringify(BudgetMother.testBudgetList()),
    );
  });
});
