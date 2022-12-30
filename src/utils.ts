import { useState, useEffect } from "react";
import { Budget } from "./components/Budget";
import { ItemForm } from "./components/ItemForm";

export function round(number: number, precision: number) {
  return +(Math.round(Number(number + "e+" + precision)) + "e-" + precision);
}

export function calcTotal(values: Array<ItemForm>): number {
  const total = values
    .filter((x) => !isNaN(x.value))
    .reduce((total, n) => total + n.value, 0);
  return round(total, 2);
}

export function calcAvailable(value: Budget | null): number {
  if (value !== null) {
    const expenseTotal = calcTotal(value.expenses.expenses);
    const incomeTotal = calcTotal(value.incomes.incomes);
    return round(incomeTotal - expenseTotal, 2);
  }
  return 0;
}

export function calcWithGoal(value: Budget | null): number {
  if (value !== null) {
    const available = calcAvailable(value);
    const savings = (value.stats.goal * calcTotal(value.incomes.incomes)) / 100;
    return round(available - savings, 2);
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
