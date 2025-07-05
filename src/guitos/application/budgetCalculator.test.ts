import Big from "big.js";
import { describe, expect, test } from "vitest";
import type { Budget } from "../domain/budget";
import { BudgetMother } from "../domain/budget.mother";
import { BudgetItemsMother } from "../domain/budgetItem.mother";
import { BudgetCalculator } from "./budgetCalculator";

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
    expect(
      BudgetCalculator.available(BudgetMother.testBudget() as Budget),
    ).toEqual(Big(90));
    expect(BudgetCalculator.available(undefined)).toEqual(Big(0));
  });

  test("availableWithGoal", () => {
    expect(
      BudgetCalculator.availableWithGoal(BudgetMother.testBudget() as Budget),
    ).eq(80);
  });

  test("saved", () => {
    expect(BudgetCalculator.saved(BudgetMother.testBudget() as Budget)).eq(10);
  });

  test("automaticGoal", () => {
    expect(BudgetCalculator.automaticGoal(BudgetMother.testBigBudget())).eq(
      93.36298,
    );
  });

  test("revenuePercentage", () => {
    expect(
      BudgetCalculator.revenuePercentage(BudgetMother.testBudget() as Budget),
    ).eq(10);
  });
});
