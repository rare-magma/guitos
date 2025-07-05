import Papa from "papaparse";
import { describe, expect, test } from "vitest";
import { BudgetMother } from "../domain/budget.mother";
import { BudgetCsvService } from "./budgetCsvService";

describe("BudgetCsvService", () => {
  test("fromCsv", () => {
    const csvObject = Papa.parse(BudgetMother.testCsv() as string, {
      header: true,
      skipEmptyLines: "greedy",
    });
    expect(
      BudgetCsvService.fromCsv(csvObject.data as string[], "2023-03"),
    ).toEqual(BudgetMother.testBudgetCsv());
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
});
