import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { BudgetItemsMother } from "@guitos/contexts/budget/domain/budgetItem.mother";
import Big from "big.js";
import { describe, expect, test } from "vitest";

describe("BudgetCalculator", () => {
  test("itemsTotal", () => {
    expect(
      BudgetCalculator.itemsTotal([
        BudgetItemsMother.itemForm1(),
        BudgetItemsMother.itemForm2(),
      ]),
    ).toEqual(Big(110));
    expect(BudgetCalculator.itemsTotal([])).toEqual(Big(0));
  });

  test("available", () => {
    expect(BudgetCalculator.available(BudgetMother.testBudget())).toEqual(
      Big(90),
    );
    expect(BudgetCalculator.available(undefined)).toEqual(Big(0));
  });

  test("availableWithGoal", () => {
    expect(BudgetCalculator.availableWithGoal(BudgetMother.testBudget())).eq(
      80,
    );
  });

  test("saved", () => {
    expect(BudgetCalculator.saved(BudgetMother.testBudget())).eq(10);
  });

  test("automaticGoal", () => {
    expect(BudgetCalculator.automaticGoal(BudgetMother.testBigBudget())).eq(
      93.36298,
    );
  });

  test("revenuePercentage", () => {
    expect(BudgetCalculator.revenuePercentage(BudgetMother.testBudget())).eq(
      10,
    );
  });
});
