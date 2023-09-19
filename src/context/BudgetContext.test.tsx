import { render } from "@testing-library/react";
import { testBudget, testBudgetList } from "../setupTests";
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
    const { getByLabelText } = render(
      <BudgetProvider>
        <TestComponent />
      </BudgetProvider>,
    );
    expect(getByLabelText("budget").textContent).toEqual(
      JSON.stringify(testBudget),
    );
    expect(getByLabelText("budgetList").textContent).toEqual(
      JSON.stringify(testBudgetList),
    );
  });
});
