import { describe, expect, test } from "vitest";
import { BudgetMother } from "./budget.mother";

describe("Budget", () => {
  test("createEmpty", () => {
    const budget = BudgetMother.testBudget();
    const emptyBudget = BudgetMother.testEmptyBudget();
    expect(emptyBudget).not.toBe(budget);
    expect(emptyBudget.name).toBe("2023-03");
  });

  test("clone", () => {
    const budget = BudgetMother.testBudget();
    const clonedBudget = BudgetMother.testBudgetClone();
    expect(clonedBudget).not.toBe(budget);
    expect(clonedBudget.name).toBe(`${budget.name}-clone`);
  });
});
