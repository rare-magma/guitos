import { BudgetMother } from "@guitos/domain/budget.mother";
import { MathOperation } from "@guitos/operations/domain/mathOperation";
import type { FilteredItem } from "@guitos/sections/ChartsPage/ChartsPage";
import { prompt } from "@guitos/sections/NavBar/prompt";
import { Currency } from "@guitos/userPreferences/domain/currency";
import { Locale } from "@guitos/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { LocalForageUserPreferencesRepository } from "@guitos/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { Uuid } from "@shared/domain/uuid";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";
import Big from "big.js";
import { expect, test } from "vitest";
import { chromeLocalesList } from "./guitos/infrastructure/lists/chromeLocalesList";
import { currenciesMap } from "./guitos/infrastructure/lists/currenciesMap";
import { firefoxLocalesList } from "./guitos/infrastructure/lists/firefoxLocalesList";
import {
  calc,
  createBudgetNameList,
  generatePrompt,
  getLabelKey,
  getLabelKeyFilteredItem,
  getNestedProperty,
  getNestedValues,
  intlFormat,
  median,
  parseLocaleNumber,
  roundBig,
} from "./utils";

const optionsRepository = new LocalForageUserPreferencesRepository();

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
  const date = new CurrentTimeClock().now();
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("JPY"), new Locale("ja-JP"), date),
    ),
  ).eq("￥123");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("EUR"), new Locale("en-IE"), date),
    ),
  ).eq("€123.45");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("USD"), new Locale("en-US"), date),
    ),
  ).eq("$123.45");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("CAD"), new Locale("en-CA"), date),
    ),
  ).eq("$123.45");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("GBP"), new Locale("en-GB"), date),
    ),
  ).eq("£123.45");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("CNY"), new Locale("zh-CN"), date),
    ),
  ).eq("¥123.45");
  expect(
    intlFormat(
      123.45,
      new UserPreferences(new Currency("AUD"), new Locale("en-AU"), date),
    ),
  ).eq("$123.45");

  for (const key in currenciesMap) {
    const currencyCode = currenciesMap[
      key as keyof typeof currenciesMap
    ] as unknown as string;

    expect(
      intlFormat(
        1,
        new UserPreferences(
          new Currency(currencyCode),
          new Locale("en-US"),
          date,
        ),
      ),
    ).toBeTruthy();
  }
});

test.skip("intlFormat browser locale list", () => {
  const date = new CurrentTimeClock().now();
  for (const list of [
    firefoxLocalesList.filter((l) => l !== "ja-JP-mac" && l !== "ach"),
    chromeLocalesList,
  ]) {
    for (const locale of list) {
      const countryCode = optionsRepository.getCountryCode(locale);
      const currencyCode =
        optionsRepository.getCurrencyCodeFromCountry(countryCode);
      expect(
        intlFormat(
          1,
          new UserPreferences(
            new Currency(currencyCode),
            new Locale(locale),
            date,
          ),
        ),
      ).toBeTruthy();
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
  expect(calc(123.45, 100, MathOperation.Add)).eq(223.45);
  expect(calc(123.45, 100, MathOperation.Subtract)).eq(23.45);
  expect(calc(123.45, 100, MathOperation.Multiply)).eq(12345);
  expect(calc(123.45, 100, MathOperation.Divide)).eq(1.23);
  expect(calc(0, 100, MathOperation.Subtract)).eq(0);
  expect(calc(0, 100, MathOperation.Multiply)).eq(0);
  expect(calc(0, 100, MathOperation.Divide)).eq(0);
  expect(() => calc(0, 100, "sqrt" as unknown as MathOperation)).toThrow();
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

test("generatePrompt", () => {
  expect(generatePrompt(BudgetMother.testBudget().toString())).contain(
    prompt,
    BudgetMother.testBudget().toString(),
  );
});
