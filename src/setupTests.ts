// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { randomUUID } from "node:crypto";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, expect, vi } from "vitest";
import * as AppBudgetContext from "./context/BudgetContext";
import * as AppConfigContext from "./context/ConfigContext";
import * as AppGeneralContext from "./context/GeneralContext";
import { BudgetMother } from "./guitos/domain/budget.mother";

window.crypto.randomUUID = randomUUID;
global.URL.createObjectURL = vi.fn();

vi.mock("crypto", () => ({
  randomUUID: () => "035c2de4-00a4-403c-8f0e-f81339be9a4e",
}));

// silence recharts ResponsiveContainer error
vi.mock("recharts", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    //@ts-ignore
    ...originalModule,
    ResponsiveContainer: () => createElement("div"),
  };
});

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

export const configContextSpy = vi.spyOn(AppConfigContext, "useConfig");
export const budgetContextSpy = vi.spyOn(AppBudgetContext, "useBudget");
export const generalContextSpy = vi.spyOn(
  AppGeneralContext,
  "useGeneralContext",
);

beforeEach(() => {
  budgetContextSpy.mockReturnValue(testBudgetContext);
  configContextSpy.mockReturnValue(testConfigContext);
  generalContextSpy.mockReturnValue(testGeneralContext);
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
export const testIntlConfig = { locale: "en-US", currency: "USD" };
export const testSpanishIntlConfig = { locale: "es-ES", currency: "EUR" };

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
export const undoMock = vi.fn();
export const redoMock = vi.fn();
export const testEmptyBudgetContext = {
  budget: undefined,
  setBudget: setBudgetMock,

  budgetList: [],
  setBudgetList: setBudgetListMock,

  budgetNameList: [],
  setBudgetNameList: setBudgetNameListMock,

  revenuePercentage: 0,
  past: [],
  future: [],
  needReload: true,
  undo: undoMock,
  redo: redoMock,
  canUndo: false,
  canRedo: false,
};

export const testBudgetContext = {
  budget: BudgetMother.testBudget(),
  setBudget: setBudgetMock,

  budgetList: BudgetMother.testBudgetList(),
  setBudgetList: setBudgetListMock,

  budgetNameList: BudgetMother.testBudgetNameList(),
  setBudgetNameList: setBudgetNameListMock,

  revenuePercentage: 10,
  past: [],
  future: [],
  undo: undoMock,
  redo: redoMock,
  canUndo: false,
  canRedo: false,
};

export const setNeedReloadMock = vi.fn();
export const setLoadingFromDBMock = vi.fn();
export const setErrorMock = vi.fn();
export const setCsvErrorsMock = vi.fn();
export const setJsonErrorsMock = vi.fn();
export const setShowErrorMock = vi.fn();
export const setNotificationsMock = vi.fn();
export const handleErrorMock = vi.fn();
export const testGeneralContext = {
  needReload: false,
  setNeedReload: setNeedReloadMock,
  loadingFromDB: false,
  setLoadingFromDB: setLoadingFromDBMock,
  error: "",
  setError: setErrorMock,
  csvErrors: [],
  setCsvErrors: setCsvErrorsMock,
  jsonErrors: [],
  setJsonErrors: setJsonErrorsMock,
  showError: false,
  setShowError: setShowErrorMock,
  notifications: [],
  setNotifications: setNotificationsMock,
  handleError: handleErrorMock,
};

const jsonErrors: AppGeneralContext.JsonError[] = [
  {
    errors:
      "SyntaxError: Expected ',' or '}' after property value in JSON at position 209",
    file: "123.json",
  },
];

const csvErrors: AppGeneralContext.CsvError[] = [
  {
    errors: [
      {
        type: "FieldMismatch",
        code: "TooFewFields",
        message: "Line 0: Too few fields: expected 3 fields but parsed 2",
        row: 0,
      },
    ],
    file: "123.csv",
  },
];

const error = "Thrown error";

export const testErrorGeneralContext = {
  ...testGeneralContext,
  error: error,
  showError: true,
};

export const testJsonErrorGeneralContext = {
  ...testGeneralContext,
  jsonErrors: jsonErrors,
  showError: true,
};

export const testCsvErrorGeneralContext = {
  ...testGeneralContext,
  csvErrors: csvErrors,
  showError: true,
};
