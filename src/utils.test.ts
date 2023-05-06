import { expect, test } from "vitest";
import {
  calcAutoGoal,
  calcAvailable,
  calcPercentage,
  calcSaved,
  calcTotal,
  calcWithGoal,
  convertCsvToBudget,
  createBudgetNameList,
  intlFormat,
  roundBig,
} from "./utils";
import Papa from "papaparse";
import {
  itemForm1,
  itemForm2,
  testBigBudget,
  testBudget,
  testBudget2,
  testBudgetCsv,
  testCsv,
} from "./setupTests";
import Big from "big.js";

test("round", () => {
  expect(roundBig(Big(123.123123123), 5)).eq(123.12312);
  expect(roundBig(Big(123.123), 2)).eq(123.12);
  expect(roundBig(Big(1.125324235131234), 2)).eq(1.13);
  expect(roundBig(Big(123.124), 2)).eq(123.12);
  expect(roundBig(Big(123.125), 2)).eq(123.13);
  expect(roundBig(Big(123.125), 1)).eq(123.1);
  expect(roundBig(Big(123.126), 0)).eq(123);
});

test("calcTotal", () => {
  expect(calcTotal([itemForm1, itemForm2])).toEqual(Big(110));
  expect(calcTotal([])).toEqual(Big(0));
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
  expect(calcAvailable(testBudget)).toEqual(Big(90));
  expect(calcAvailable(null)).toEqual(Big(0));
});

test("calcWithGoal", () => {
  expect(calcWithGoal(testBudget)).eq(80);
  expect(calcWithGoal(null)).eq(0);
});

test("calcSaved", () => {
  expect(calcSaved(testBudget)).eq(10);
  expect(calcSaved(null)).eq(0);
});

test("calcAutoGoal", () => {
  expect(calcAutoGoal(testBigBudget)).eq(93.36298);
  expect(calcAutoGoal(null)).eq(0);
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

test("intlFormat", () => {
  expect(intlFormat(123.45, "JPY")).eq("¥123");
  expect(intlFormat(123.45, "EUR")).eq("€123.45");
  expect(intlFormat(123.45, "USD")).eq("$123.45");
  expect(intlFormat(123.45, "CAD")).eq("CA$123.45");
  expect(intlFormat(123.45, "GBP")).eq("£123.45");
  expect(intlFormat(123.45, "CNY")).eq("CN¥123.45");
  expect(intlFormat(123.45, "AUD")).eq("A$123.45");
  expect(calcAutoGoal(null)).eq(0);
});
