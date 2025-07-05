import { describe, expect, test } from "vitest";
import { BudgetMother } from "./budget.mother";
import { BudgetItem } from "./budgetItem";
import { BudgetItemsMother } from "./budgetItem.mother";

describe("BudgetItem", () => {
  test("percentage", () => {
    expect(
      BudgetItem.percentage(
        BudgetItemsMother.itemForm1().value,
        BudgetMother.testBudget().incomes.total,
      ),
    ).eq(10);
    expect(
      BudgetItem.percentage(
        BudgetItemsMother.itemForm2().value,
        BudgetMother.testBudget().incomes.total,
      ),
    ).eq(100);
    expect(
      BudgetItem.percentage(
        BudgetItemsMother.itemForm1().value,
        BudgetMother.testBudget().expenses.total,
      ),
    ).eq(100);
    expect(
      BudgetItem.percentage(
        BudgetItemsMother.itemForm2().value,
        BudgetMother.testBudget().expenses.total,
      ),
    ).eq(1000);
    expect(BudgetItem.percentage(0, 0)).eq(0);
    expect(
      BudgetItem.percentage(0, BudgetMother.testBudget().incomes.total),
    ).eq(0);
    expect(
      BudgetItem.percentage(0, BudgetMother.testBudget().expenses.total),
    ).eq(0);
  });
});
