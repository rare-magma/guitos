// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { randomUUID } from "node:crypto";
import { afterEach, expect, vi } from "vitest";
import { Budget } from "./components/Budget/Budget";
import { ItemForm } from "./components/ItemForm/ItemForm";
import * as AppBudgetContext from "./context/BudgetContext";
import * as AppConfigContext from "./context/ConfigContext";

window.crypto.randomUUID = randomUUID;
// global.URL.createObjectURL = vi.fn();

vi.mock("crypto", () => ({
  randomUUID: () => "035c2de4-00a4-403c-8f0e-f81339be9a4e",
}));

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

export const configContextSpy = vi.spyOn(AppConfigContext, "useConfig");
export const budgetContextSpy = vi.spyOn(AppBudgetContext, "useBudget");

beforeEach(() => {
  budgetContextSpy.mockReturnValue(testBudgetContext);
  configContextSpy.mockReturnValue(testConfigContext);
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

export const testBudget = new Budget({
  id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
  name: "2023-03",
  expenses: {
    items: [{ id: 1, name: "expense1", value: 10 }],
    total: 10,
  },
  incomes: {
    items: [{ id: 2, name: "income1", value: 100 }],
    total: 100,
  },
  stats: {
    available: 90,
    withGoal: 80,
    saved: 10,
    goal: 10,
    reserves: 200,
  },
});

export const testBudget2 = new Budget({
  id: "135b2ce4-00a4-403c-8f0e-f81339be9a4e",
  name: "2023-04",
  expenses: {
    items: [{ id: 1, name: "name", value: 50 }],
    total: 50,
  },
  incomes: {
    items: [{ id: 2, name: "name2", value: 200 }],
    total: 200,
  },
  stats: {
    available: 150,
    withGoal: 130,
    saved: 20,
    goal: 35,
    reserves: 30,
  },
});

export const testBigBudget = new Budget({
  id: "225c2de5-00a4-403c-8f0e-f81339be9a4e",
  name: "2023-03",
  expenses: {
    items: [
      { id: 1, name: "name", value: 11378.64 },
      { id: 4, name: "name2", value: 11378.64 },
    ],
    total: 22757.28,
  },
  incomes: {
    items: [
      { id: 2, name: "name", value: 100.03 },
      { id: 3, name: "name2", value: 342783.83 },
    ],
    total: 342883.86,
  },
  stats: {
    available: 320126.58,
    withGoal: 148684.65,
    saved: 171441.93,
    goal: 50,
    reserves: 200,
  },
});

export const testJSONErrorBudget = `{
  id: "03123AAA5c2de4-00a4-403c-8f0e-f81339be9a4e",
  na2me: "2023-03",
  expens3es: {
    items: [{ id: "infinity", name: -1, value: "r" }],
    total: 10,
  },
  stats: {
    available: 0,
    withGoal: 0,
    saved: 0,
    goal: 10,
    reserves: 0,
  },
}`;

export const testCsv = `type,name,value
expense,rent,1000.00
expense,food,200.00
income,salary,2000.00
income,sale,100
goal,goal,10
reserves,reserves,0
`;

export const testCsvError = `type,name,value
expe2nse,rent,1000.00
expense,food,200.00,123,4
incomae,salary,2000.00
income,sale,100
goal,123,goal
goal,,goal,,,
reservaes,reserves,0
`;

export const testBudgetCsv = {
  id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
  name: "2023-03",
  expenses: {
    items: [
      new ItemForm({ id: 0, name: "rent", value: 1000 }),
      new ItemForm({ id: 1, name: "food", value: 200 }),
    ],
    total: 1200,
  },
  incomes: {
    items: [
      new ItemForm({ id: 2, name: "salary", value: 2000 }),
      new ItemForm({ id: 3, name: "sale", value: 100 }),
    ],
    total: 2100,
  },
  stats: {
    available: 900,
    withGoal: 690,
    saved: 210,
    goal: 10,
    reserves: 0,
  },
};

export const budgetNameList = [
  {
    id: "035c2de4-01a4-403c-8f0e-f81340be9a4e",
    name: "2023-03",
  },
  {
    id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
    name: "2023-04",
  },
  {
    id: "036c2de4-00a4-402c-8f0e-f81339be9a4e",
    name: "2023-05",
  },
];

export const itemForm1 = new ItemForm({
  id: 1,
  name: "name1",
  value: 10,
});

export const itemForm2 = new ItemForm({
  id: 2,
  name: "name2",
  value: 100,
});

export const testIntlConfig = { locale: "en-US", currency: "USD" };
export const testSpanishIntlConfig = { locale: "es-ES", currency: "EUR" };

export const testBudgetList = [testBudget, testBudget2, testBigBudget];

export const testBudgetNameList = [
  {
    id: testBudget.id,
    item: "",
    name: testBudget.name,
  },
  {
    id: testBudget2.id,
    item: "",
    name: testBudget2.name,
  },
];

export const setIntlConfigMock = vi.fn();
export const handleCurrencyMock = vi.fn();
export const testConfigContext = {
  intlConfig: testIntlConfig || undefined,
  setIntlConfig: setIntlConfigMock,
  currency: "USD",
  handleCurrency: handleCurrencyMock,
};

export const testSpanishConfigContext = {
  intlConfig: testSpanishIntlConfig,
  setIntlConfig: setIntlConfigMock,
  currency: "EUR",
  handleCurrency: handleCurrencyMock,
};

export const setBudgetMock = vi.fn();
export const setBudgetListMock = vi.fn();
export const setBudgetNameListMock = vi.fn();
export const testEmptyBudgetContext = {
  budget: undefined,
  setBudget: setBudgetMock,

  budgetList: [],
  setBudgetList: setBudgetListMock,

  budgetNameList: [],
  setBudgetNameList: setBudgetNameListMock,

  revenuePercentage: 0,
};

export const testBudgetContext = {
  budget: testBudget,
  setBudget: setBudgetMock,

  budgetList: testBudgetList,
  setBudgetList: setBudgetListMock,

  budgetNameList: testBudgetNameList,
  setBudgetNameList: setBudgetNameListMock,

  revenuePercentage: 10,
};
