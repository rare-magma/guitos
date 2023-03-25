import { useState, useEffect } from "react";
import { Budget } from "./components/Budget";
import { ItemForm } from "./components/ItemForm";
import { CsvItem } from "./components/CsvItem";

export function round(number: number, precision: number) {
  return +(Math.round(Number(number + "e+" + precision)) + "e-" + precision);
}

export function calcTotal(values: Array<ItemForm>): number {
  const total =
    values &&
    values
      .filter((x) => !isNaN(x.value))
      .reduce((total, n) => total + n.value, 0);
  return round(total, 2);
}

export function calcAvailable(value: Budget | null): number {
  if (value !== null) {
    const expenseTotal = calcTotal(value.expenses.items);
    const incomeTotal = calcTotal(value.incomes.items);
    return round(incomeTotal - expenseTotal, 2);
  }
  return 0;
}

export function calcWithGoal(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const available = calcAvailable(value);
    const reserves = (value.stats.goal * calcTotal(value.incomes.items)) / 100;
    return round(available - reserves, 2);
  }
  return 0;
}

export function calcSaved(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const available = calcTotal(value.incomes.items);
    const saved = (value.stats.goal * available) / 100;
    return round(saved, 2);
  }
  return 0;
}

function getStorageValue(key: string, defaultValue: string) {
  const saved = localStorage.getItem(key);
  let initial;
  if (saved !== null) {
    initial = JSON.parse(saved);
  }
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const numberInputOnWheelPreventChange = (e: any) => {
  e.target.blur();
  e.stopPropagation();
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const convertCsvToBudget = (csv: string[], date: string): Budget => {
  const newId = crypto.randomUUID();
  const emptyExpenses: ItemForm[] = [];
  const emptyIncomes: ItemForm[] = [];
  const newBudget = {
    id: newId,
    name: date,
    expenses: {
      items: emptyExpenses,
      total: 0,
    },
    incomes: {
      items: emptyIncomes,
      total: 0,
    },
    stats: {
      available: 0,
      withGoal: 0,
      saved: 0,
      goal: 10,
      reserves: 0,
    },
  };

  csv.forEach((value: string, key: number) => {
    const item = value as unknown as CsvItem;
    const newItemForm = new ItemForm({
      id: key,
      name: item.name,
      value: Number(item.value),
    });

    switch (item.type) {
      case "expense":
        newBudget.expenses.items.push(newItemForm);
        newBudget.expenses.total = calcTotal(newBudget.expenses.items);
        break;
      case "income":
        newBudget.incomes.items.push(newItemForm);
        newBudget.incomes.total = calcTotal(newBudget.incomes.items);
        break;
      case "goal":
        newBudget.stats.goal = item.value;
        break;
      case "reserves":
        newBudget.stats.reserves = item.value;
        break;
    }
  });

  newBudget.stats.available = calcAvailable(newBudget);
  newBudget.stats.withGoal = calcWithGoal(newBudget);
  newBudget.stats.saved = calcSaved(newBudget);

  return newBudget as unknown as Budget;
};
