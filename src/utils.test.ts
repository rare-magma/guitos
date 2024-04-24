import Big from "big.js";
import Papa from "papaparse";
import { expect, test } from "vitest";
import { Budget } from "./components/Budget/Budget";
import { ItemOperation } from "./components/CalculateButton/CalculateButton";
import { FilteredItem } from "./components/ChartsPage/ChartsPage";
import { chromeLocalesList } from "./lists/chromeLocalesList";
import { currenciesMap } from "./lists/currenciesMap";
import { firefoxLocalesList } from "./lists/firefoxLocalesList";
import {
  itemForm1,
  itemForm2,
  testBigBudget,
  testBudget,
  testBudget2,
  testBudgetCsv,
  testBudgetList,
  testCsv,
} from "./setupTests";
import {
  budgetToCsv,
  calc,
  calcAutoGoal,
  calcAvailable,
  calcPercentage,
  calcSaved,
  calcTotal,
  calcWithGoal,
  convertCsvToBudget,
  createBudgetNameList,
  createNewBudget,
  getCountryCode,
  getCurrencyCode,
  getLabelKey,
  getLabelKeyFilteredItem,
  getNestedProperty,
  getNestedValues,
  intlFormat,
  median,
  parseLocaleNumber,
  roundBig,
} from "./utils";

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
  expect(
    calcWithGoal({
      stats: { goal: "a" as unknown as number },
    } as Budget),
  ).eq(0);
});

test("calcSaved", () => {
  expect(calcSaved(testBudget)).eq(10);
  expect(
    calcSaved({
      stats: { goal: "a" as unknown as number },
    } as Budget),
  ).eq(0);
});

test("calcAutoGoal", () => {
  expect(calcAutoGoal(testBigBudget)).eq(93.36298);
  expect(
    calcAutoGoal({
      stats: { goal: "a" as unknown as number },
    } as Budget),
  ).eq(0);
});

test("convertCsvToBudget", () => {
  const csvObject = Papa.parse(testCsv as string, {
    header: true,
    skipEmptyLines: "greedy",
  });
  expect(convertCsvToBudget(csvObject.data as string[], "2023-03")).toEqual(
    testBudgetCsv,
  );
});

test("createBudgetNameList", () => {
  const expectedResult = [
    {
      id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
      item: "",
      name: "2023-03",
    },
    {
      id: "135b2ce4-00a4-403c-8f0e-f81339be9a4e",
      item: "",
      name: "2023-04",
    },
  ];
  expect(createBudgetNameList([testBudget, testBudget2])).toEqual(
    expectedResult,
  );
  expect(createBudgetNameList([])).toEqual([]);
});

test("createNewBudget", () => {
  const expectedResult = {
    expenses: {
      items: [{ id: 1, name: "", value: 0 }],
      total: 0,
    },
    id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
    incomes: {
      items: [{ id: 1, name: "", value: 0 }],
      total: 0,
    },
    name: "2024-035c2de4",
    stats: {
      available: 0,
      goal: 10,
      reserves: 0,
      saved: 0,
      withGoal: 0,
    },
  };
  expect(createNewBudget()).toEqual(expectedResult);
});

test("intlFormat", () => {
  expect(intlFormat(123.45, "JPY")).eq("¥123");
  expect(intlFormat(123.45, "EUR")).eq("€123.45");
  expect(intlFormat(123.45, "USD")).eq("$123.45");
  expect(intlFormat(123.45, "CAD")).eq("CA$123.45");
  expect(intlFormat(123.45, "GBP")).eq("£123.45");
  expect(intlFormat(123.45, "CNY")).eq("CN¥123.45");
  expect(intlFormat(123.45, "AUD")).eq("A$123.45");

  for (const key in currenciesMap) {
    const currencyCode = currenciesMap[
      key as keyof typeof currenciesMap
    ] as unknown as string;

    expect(intlFormat(1, currencyCode)).toBeTruthy();
  }
});

test("intlFormat browser locale list", () => {
  [firefoxLocalesList, chromeLocalesList].forEach((list) => {
    list.forEach((locale) => {
      const countryCode = getCountryCode(locale);
      const currencyCode = getCurrencyCode(countryCode);
      expect(intlFormat(1, currencyCode)).toBeTruthy();
    });
  });
});

test("parseLocaleNumber", () => {
  expect(parseLocaleNumber("123.45", "en-US")).eq(123.45);
  expect(parseLocaleNumber("123,45", "es")).eq(123.45);
  expect(parseLocaleNumber("12.054.100,55", "de-DE")).eq(12054100.55);
  expect(parseLocaleNumber("1,20,54,100.55", "en-IN")).eq(12054100.55);
});

test("budgetToCsv", () => {
  expect(budgetToCsv(testBigBudget)).eq(`type,name,value
expense,name,11378.64
expense,name2,11378.64
income,name,100.03
income,name2,342783.83
goal,goal,50
reserves,reserves,200`);
});

test("calc", () => {
  expect(calc(123.45, 100, "add")).eq(223.45);
  expect(calc(123.45, 100, "subtract")).eq(23.45);
  expect(calc(123.45, 100, "multiply")).eq(12345);
  expect(calc(123.45, 100, "divide")).eq(1.23);
  expect(calc(0, 100, "subtract")).eq(0);
  expect(calc(0, 100, "multiply")).eq(0);
  expect(calc(0, 100, "divide")).eq(0);
  expect(() => calc(0, 100, "sqrt" as ItemOperation)).toThrow();
});

test("median", () => {
  expect(median([123.43, 100, 300, -500])).eq(111.715);
  expect(median([123.43, 100, 300, 500])).eq(211.715);
  expect(median([123.45, 100, 300])).eq(123.45);
  expect(median([123.45, 100])).eq(111.725);
  expect(median([123.45])).eq(123.45);
  expect(median([0])).eq(0);
  expect(median([])).eq(0);
  expect(median([-1, -2])).eq(-1.5);
});

test("getNestedProperty", () => {
  expect(getNestedProperty(testBudget, "expenses", "total")).eq(10);
  expect(getNestedProperty(testBudget, "incomes", "items")).eq(
    testBudget.incomes.items,
  );
});

test("getNestedValues", () => {
  const expected = testBudgetList.map((i) => i.expenses.total);
  const expected2 = testBudgetList.map((i) => i.incomes.items);

  expect(getNestedValues(testBudgetList, "expenses", "total")).toEqual(
    expected,
  );
  expect(getNestedValues(testBudgetList, "incomes", "items")).toEqual(
    expected2,
  );
});

test("getLabelKey", () => {
  const optionWithoutItem = {
    id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
    item: "",
    name: "2023-03",
  };
  const option = {
    id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
    item: "item name",
    name: "2023-03",
  };
  expect(getLabelKey(optionWithoutItem)).toEqual("2023-03");
  expect(getLabelKey(option)).toEqual("2023-03 item name");
});

test("getLabelKeyFilteredItem", () => {
  const optionWithoutItem: FilteredItem = {
    id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
    name: "2023-03",
    item: "abcd",
    value: 1,
    type: "efgh",
  };
  expect(getLabelKeyFilteredItem(optionWithoutItem)).toEqual(
    "abcd (2023-03 efgh)",
  );
});
