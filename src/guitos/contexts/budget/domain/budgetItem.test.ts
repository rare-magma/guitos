import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { BudgetItemsMother } from "@guitos/contexts/budget/domain/budgetItem.mother";
import { describe, expect, test } from "vitest";

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
