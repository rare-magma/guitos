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
import type { BudgetContextInterface } from "./guitos/context/BudgetContext";
import * as AppBudgetContext from "./guitos/context/BudgetContext";
import { BudgetMother } from "./guitos/domain/budget.mother";

window.crypto.randomUUID = randomUUID;
window.isSecureContext = true;
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

export const budgetContextSpy = vi.spyOn(AppBudgetContext, "useBudget");
beforeEach(() => {
  budgetContextSpy.mockReturnValue(testBudgetContext);
});

// runs a cleanup after each test case (e.g. clearing happy-dom)
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
  shouldReload: true,
  undo: undoMock,
  redo: redoMock,
  canUndo: false,
  canRedo: false,
};

export const testBudgetContext: BudgetContextInterface = {
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
