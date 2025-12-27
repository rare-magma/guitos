import {
  BudgetCsvService,
  type CsvRow,
} from "@guitos/application/react/budgetCsvService";
import { BudgetMother } from "@guitos/domain/budget.mother";
import Papa from "papaparse";
import { describe, expect, test } from "vitest";

describe("BudgetCsvService", () => {
  test("fromCsv", () => {
    const csvObject = Papa.parse(BudgetMother.testCsv() as string, {
      header: true,
      skipEmptyLines: "greedy",
    });
    expect(
      BudgetCsvService.fromCsv(csvObject.data as CsvRow[], "2023-03"),
    ).toEqual(BudgetMother.testBudgetCsv());
  });

  test("fromCsv should ignore malformed rows and only parse valid ones", () => {
    const csv = Papa.parse(BudgetMother.testCsvError(), {
      header: true,
      skipEmptyLines: "greedy",
    });

    const budget = BudgetCsvService.fromCsv(csv.data as CsvRow[], "2023-04");

    expect(budget.expenses.items.length).toBeGreaterThanOrEqual(1);
    expect(budget.incomes.items.length).toBeGreaterThanOrEqual(1);
    expect(typeof budget.stats.goal).toBe("number");
    expect(typeof budget.stats.reserves).toBe("number");

    const hasNaN = [...budget.expenses.items, ...budget.incomes.items].some(
      (item) => Number.isNaN(item.value),
    );
    expect(hasNaN).toBe(false);
  });

  test("toCsv", () => {
    expect(
      BudgetCsvService.toCsv(BudgetMother.testBigBudget()),
    ).eq(`type,name,value
expense,name,11378.64
expense,name2,11378.64
income,name,100.03
income,name2,342783.83
goal,goal,50
reserves,reserves,200`);
  });

  test("toCsv should handle empty budget with no items", () => {
    const emptyBudget = BudgetMother.testEmptyBudget();
    const csv = BudgetCsvService.toCsv(emptyBudget);

    expect(csv).toBe(`type,name,value
goal,goal,0
reserves,reserves,0`);
  });

  test("toCsv should skip items with NaN or undefined values", () => {
    const budget = BudgetMother.testBudget();
    budget.incomes.items.push({
      id: 3,
      name: "brokenIncome",
      value: Number.NaN,
    });
    budget.expenses.items.push({
      id: 4,
      name: "badExpense",
      value: undefined as unknown as number,
    });

    const csv = BudgetCsvService.toCsv(budget);

    expect(csv).toContain("expense,expense1,10");
    expect(csv).toContain("income,income1,100");
  });
});
