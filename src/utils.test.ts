import { expect, test } from "vitest";
import {
  calcAvailable,
  calcPercentage,
  calcSaved,
  calcTotal,
  calcWithGoal,
  convertCsvToBudget,
  createBudgetNameList,
  round,
} from "./utils";
import Papa from "papaparse";
import {
  itemForm1,
  itemForm2,
  testBudget,
  testBudget2,
  testBudgetCsv,
  testCsv,
} from "./setupTests";

test("round", () => {
  expect(round(123.123, 5)).eq(123.123);
  expect(round(123.123, 2)).eq(123.12);
  expect(round(123.125, 2)).eq(123.13);
  expect(round(123.123, 1)).eq(123.1);
  expect(round(123.126, 1)).eq(123.1);
  expect(round(123.126, 0)).eq(123);
});

test("calcTotal", () => {
  expect(calcTotal([itemForm1, itemForm2])).eq(110);
  expect(calcTotal([])).eq(0);
});

test("calcPercentage", () => {
  expect(calcPercentage(itemForm1.value, testBudget.incomes.total)).eq(10);
  expect(calcPercentage(itemForm2.value, testBudget.incomes.total)).eq(100);
  expect(calcPercentage(itemForm1.value, testBudget.expenses.total)).eq(100);
  expect(calcPercentage(itemForm2.value, testBudget.expenses.total)).eq(1000);
  expect(calcPercentage(0, 0)).eq(0);
  expect(calcPercentage(0, testBudget.incomes.total)).eq(0);
  expect(calcPercentage(0, testBudget.expenses.total)).eq(0);
});

test("calcAvailable", () => {
  expect(calcAvailable(testBudget)).eq(90);
  expect(calcAvailable(null)).eq(0);
});

test("calcWithGoal", () => {
  expect(calcWithGoal(testBudget)).eq(80);
  expect(calcWithGoal(null)).eq(0);
});

test("calcSaved", () => {
  expect(calcSaved(testBudget)).eq(10);
  expect(calcSaved(null)).eq(0);
});

test("convertCsvToBudget", () => {
  const csvObject = Papa.parse(testCsv as string, {
    header: true,
    skipEmptyLines: "greedy",
  });
  expect(convertCsvToBudget(csvObject.data as string[], "2023-03")).toEqual(
    testBudgetCsv
  );
});

test("createBudgetNameList", () => {
  const expectedResult = [
    {
      id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
      name: "2023-03",
    },
    {
      id: "135b2ce4-00a4-403c-8f0e-f81339be9a4e",
      name: "2023-04",
    },
  ];
  expect(createBudgetNameList([testBudget, testBudget2])).toEqual(
    expectedResult
  );
  expect(createBudgetNameList([])).toEqual([]);
});
