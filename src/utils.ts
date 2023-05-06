import { Budget } from "./components/Budget";
import { ItemForm } from "./components/ItemForm";
import { CsvItem } from "./components/CsvItem";
import { dinero, toDecimal } from "dinero.js";
import * as dineroCurrencies from "@dinero.js/currencies";
import { currenciesMap } from "./currenciesMap";
import { Currency } from "dinero.js";
import { MutableRefObject } from "react";

export const userLang = navigator.language;

export const countryCode =
  userLang.split("-").length >= 2
    ? userLang.split("-")[1].toUpperCase()
    : userLang.toUpperCase();

export const initialCurrencyCode = currenciesMap[
  countryCode as keyof typeof currenciesMap
] as unknown as string;

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

export function calcPercentage(
  itemValue: number,
  revenueTotal: number
): number {
  if (!isNaN(revenueTotal) && revenueTotal > 0 && !isNaN(itemValue)) {
    const percentage = round((itemValue * 100) / revenueTotal, 2);

    if (percentage >= 1) {
      return round(percentage, 0);
    } else {
      return round(percentage, 1);
    }
  }
  return 0;
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
    const availableWithGoal =
      (value.stats.goal * calcTotal(value.incomes.items)) / 100;
    return round(available - availableWithGoal, 2);
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

export function calcAutoGoal(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const incomeTotal = calcTotal(value.incomes.items);
    const available = calcAvailable(value);

    if (incomeTotal > 0 && available > 0) {
      const autoGoal = (available * 100) / incomeTotal;
      return round(autoGoal, 2);
    }
  }
  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const numberInputOnWheelPreventChange = (e: any) => {
  e.target.blur();
  e.stopPropagation();
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const convertCsvToBudget = (csv: string[], date: string): Budget => {
  const emptyExpenses: ItemForm[] = [];
  const emptyIncomes: ItemForm[] = [];
  const newBudget = {
    id: crypto.randomUUID(),
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
      goal: 0,
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
        newBudget.stats.goal = Number(item.value);
        break;
      case "reserves":
        newBudget.stats.reserves = Number(item.value);
        break;
    }
  });

  newBudget.stats.available = calcAvailable(newBudget);
  newBudget.stats.withGoal = calcWithGoal(newBudget);
  newBudget.stats.saved = calcSaved(newBudget);

  return newBudget as unknown as Budget;
};

export const createNewBudget = (): Budget => {
  const newId = crypto.randomUUID();
  const newBudget = {
    id: newId,
    name: new Date().getFullYear() + "-" + newId.slice(0, 8),
    expenses: {
      items: [{ id: 1, name: "", value: 0 }],
      total: 0,
    },
    incomes: {
      items: [{ id: 1, name: "", value: 0 }],
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

  return newBudget;
};

export function intlFormat(
  amount: number,
  locale: Intl.LocalesArgument,
  currencyCode: string,
  options = {}
) {
  function transformer({ value, currency }): string {
    return Number(value).toLocaleString(locale, {
      ...options,
      style: "currency",
      currency: currency.code,
    });
  }

  const dineroCurrency = dineroCurrencies[
    currencyCode as keyof typeof dineroCurrencies
  ] as Currency<number>;

  const dineroObject = dinero({ amount: amount, currency: dineroCurrency });

  return toDecimal(dineroObject, transformer);
}

export const focusRef = (
  ref: MutableRefObject<HTMLInputElement | undefined>
) => {
  if (ref.current) {
    ref.current.focus();
  }
};

export const createBudgetNameList = (
  list: Budget[]
): { id: string; name: string }[] => {
  return list
    .filter((b: Budget) => b && b.id !== undefined && b.name !== undefined)
    .map((b: Budget) => {
      return { id: b.id, name: b.name };
    });
};
