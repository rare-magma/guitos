import Big from "big.js";
import Papa from "papaparse";
import { expect, test, describe } from "vitest";
import { Budget } from "./budget";
import { BudgetMother } from "./budget.mother";
import { BudgetItem } from "./budgetItem";
import { BudgetItemsMother } from "./budgetItem.mother";

describe("Budget", () => {
  test("itemsTotal", () => {
    expect(
      Budget.itemsTotal([
        BudgetItemsMother.itemForm1(),
        BudgetItemsMother.itemForm2(),
      ]),
    ).toEqual(Big(110));
    expect(Budget.itemsTotal([])).toEqual(Big(0));
  });

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

  test("available", () => {
    expect(Budget.available(BudgetMother.testBudget() as Budget)).toEqual(
      Big(90),
    );
    expect(Budget.available(undefined)).toEqual(Big(0));
  });

  test("availableWithGoal", () => {
    expect(Budget.availableWithGoal(BudgetMother.testBudget() as Budget)).eq(
      80,
    );
  });

  test("saved", () => {
    expect(Budget.saved(BudgetMother.testBudget() as Budget)).eq(10);
  });

  test("automaticGoal", () => {
    expect(Budget.automaticGoal(BudgetMother.testBigBudget())).eq(93.36298);
  });

  test("fromCsv", () => {
    const csvObject = Papa.parse(BudgetMother.testCsv() as string, {
      header: true,
      skipEmptyLines: "greedy",
    });
    expect(Budget.fromCsv(csvObject.data as string[], "2023-03")).toEqual(
      BudgetMother.testBudgetCsv(),
    );
  });

  test("toCsv", () => {
    expect(Budget.toCsv(BudgetMother.testBigBudget())).eq(`type,name,value
expense,name,11378.64
expense,name2,11378.64
income,name,100.03
income,name2,342783.83
goal,goal,50
reserves,reserves,200`);
  });
});
