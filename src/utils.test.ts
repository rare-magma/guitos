import { expect, test } from "vitest";
import {
  calcAvailable,
  calcSaved,
  calcTotal,
  calcWithGoal,
  convertCsvToBudget,
  round,
} from "./utils";
import { ItemForm } from "./components/ItemForm";
import { Budget } from "./components/Budget";
import Papa from "papaparse";

const testBudget = new Budget({
  id: "035c2de4-00a4-403c-8f0e-f81339be9a4e",
  name: "2023-03",
  expenses: {
    items: [{ id: 0, name: "name", value: 10 }],
    total: 0,
  },
  incomes: {
    items: [{ id: 0, name: "name", value: 100 }],
    total: 0,
  },
  stats: {
    available: 0,
    withGoal: 0,
    saved: 0,
    goal: 10,
    reserves: 0,
  },
});

const itemForm1 = new ItemForm({
  id: 1,
  name: "name1",
  value: 10,
});
const itemForm2 = new ItemForm({
  id: 2,
  name: "name2",
  value: 100,
});

const testCsv = `type,name,value
expense,rent,1000.00
expense,food,200.00
income,salary,2000.00
income,sale,100
goal,goal,10
reserves,reserves,0
`;

const testBudgetCsv = {
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
    goal: "10",
    reserves: "0",
  },
};

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
