import Big from "big.js";
import { expect, test } from "vitest";
import { BudgetMother } from "./guitos/domain/budget.mother";
import type { ItemOperation } from "./guitos/domain/calculationHistoryItem";
import { UserOptions } from "./guitos/domain/userOptions";
import { Uuid } from "./guitos/domain/uuid";
import { localForageOptionsRepository } from "./guitos/infrastructure/localForageOptionsRepository";
import type { FilteredItem } from "./guitos/sections/ChartsPage/ChartsPage";
import { chromeLocalesList } from "./lists/chromeLocalesList";
import { currenciesMap } from "./lists/currenciesMap";
import { firefoxLocalesList } from "./lists/firefoxLocalesList";
import {
  calc,
  createBudgetNameList,
  getLabelKey,
  getLabelKeyFilteredItem,
  getNestedProperty,
  getNestedValues,
  intlFormat,
  median,
  parseLocaleNumber,
  roundBig,
} from "./utils";

const optionsRepository = new localForageOptionsRepository();

test("round", () => {
  expect(roundBig(Big(123.123123123), 5)).eq(123.12312);
  expect(roundBig(Big(123.123), 2)).eq(123.12);
  expect(roundBig(Big(1.125324235131234), 2)).eq(1.13);
  expect(roundBig(Big(123.124), 2)).eq(123.12);
  expect(roundBig(Big(123.125), 2)).eq(123.13);
  expect(roundBig(Big(123.125), 1)).eq(123.1);
  expect(roundBig(Big(123.126), 0)).eq(123);
});

test("createBudgetNameList", () => {
  const expectedResult = [
    {
      id: Uuid.random(),
      item: "",
      name: "2023-03",
    },
    {
      id: Uuid.random(),
      item: "",
      name: "2023-04",
    },
  ];
  expect(
    createBudgetNameList([
      BudgetMother.testBudget(),
      BudgetMother.testBudget2(),
    ]),
  ).toEqual(expectedResult);
  expect(createBudgetNameList([])).toEqual([]);
});

test("intlFormat", () => {
  expect(intlFormat(123.45, new UserOptions("JPY", "ja-JP"))).eq("￥123");
  expect(intlFormat(123.45, new UserOptions("EUR", "en-IE"))).eq("€123.45");
  expect(intlFormat(123.45, new UserOptions("USD", "en-US"))).eq("$123.45");
  expect(intlFormat(123.45, new UserOptions("CAD", "en-CA"))).eq("$123.45");
  expect(intlFormat(123.45, new UserOptions("GBP", "en-GB"))).eq("£123.45");
  expect(intlFormat(123.45, new UserOptions("CNY", "cn-CN"))).eq("CN¥123.45");
  expect(intlFormat(123.45, new UserOptions("AUD", "en-AU"))).eq("$123.45");

  for (const key in currenciesMap) {
    const currencyCode = currenciesMap[
      key as keyof typeof currenciesMap
    ] as unknown as string;

    expect(intlFormat(1, new UserOptions(currencyCode, "en-US"))).toBeTruthy();
  }
});

test("intlFormat browser locale list", () => {
  for (const list of [
    firefoxLocalesList.filter((l) => l !== "ja-JP-mac"),
    chromeLocalesList,
  ]) {
    for (const locale of list) {
      const countryCode = optionsRepository.getCountryCode(locale);
      const currencyCode =
        optionsRepository.getCurrencyCodeFromCountry(countryCode);
      expect(intlFormat(1, new UserOptions(currencyCode, locale))).toBeTruthy();
    }
  }
});

test("parseLocaleNumber", () => {
  expect(parseLocaleNumber("123.45", "en-US")).eq(123.45);
  expect(parseLocaleNumber("123,45", "es")).eq(123.45);
  expect(parseLocaleNumber("12.054.100,55", "de-DE")).eq(12054100.55);
  expect(parseLocaleNumber("1,20,54,100.55", "en-IN")).eq(12054100.55);
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
  expect(getNestedProperty(BudgetMother.testBudget(), "expenses", "total")).eq(
    10,
  );
  expect(
    getNestedProperty(BudgetMother.testBudget(), "incomes", "items"),
  ).toEqual(BudgetMother.testBudget().incomes.items);
});

test("getNestedValues", () => {
  const expected = BudgetMother.testBudgetList().map((i) => i.expenses.total);
  const expected2 = BudgetMother.testBudgetList().map((i) => i.incomes.items);

  expect(
    getNestedValues(BudgetMother.testBudgetList(), "expenses", "total"),
  ).toEqual(expected);
  expect(
    getNestedValues(BudgetMother.testBudgetList(), "incomes", "items"),
  ).toEqual(expected2);
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
    id: Uuid.random(),
    name: "2023-03",
    item: "abcd",
    value: 1,
    type: "abcd",
  };
  expect(getLabelKeyFilteredItem(optionWithoutItem)).toEqual(
    "abcd (2023-03 abcd)",
  );
});
