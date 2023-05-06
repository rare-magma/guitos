import { Budget } from "./components/Budget";
import { ItemForm } from "./components/ItemForm";
import { CsvItem } from "./components/CsvItem";
import { dinero, toDecimal } from "dinero.js";
import * as dineroCurrencies from "@dinero.js/currencies";
import { currenciesMap } from "./currenciesMap";
import { Currency } from "dinero.js";
import { MutableRefObject } from "react";
import Big from "big.js";

export const userLang = navigator.language;

export const countryCode =
  userLang.split("-").length >= 2
    ? userLang.split("-")[1].toUpperCase()
    : userLang.toUpperCase();

export const initialCurrencyCode = currenciesMap[
  countryCode as keyof typeof currenciesMap
] as unknown as string;

export function roundBig(number: Big, precision: number): number {
  return Big(number).round(precision, 1).toNumber();
}

export function calcTotal(values: Array<ItemForm>): Big {
  const total =
    values &&
    values
      .filter((x) => !isNaN(x.value))
      .reduce((total, n) => Big(total).add(n.value).toNumber(), 0);
  return Big(total);
}

export function calcPercentage(
  itemValue: number,
  revenueTotal: number
): number {
  if (!isNaN(revenueTotal) && revenueTotal > 0 && !isNaN(itemValue)) {
    const percentage = Big(itemValue).mul(100).div(revenueTotal);

    if (percentage.gte(1)) {
      return roundBig(percentage, 0);
    } else {
      return roundBig(percentage, 1);
    }
  }
  return 0;
}

export function calcAvailable(value: Budget | null): Big {
  if (value !== null) {
    const expenseTotal = calcTotal(value.expenses.items);
    const incomeTotal = calcTotal(value.incomes.items);
    return incomeTotal.sub(expenseTotal);
  }
  return Big(0);
}

export function calcWithGoal(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const available = calcAvailable(value);
    const availableWithGoal = Big(value.stats.goal)
      .mul(calcTotal(value.incomes.items))
      .div(100);
    return roundBig(available.sub(availableWithGoal), 2);
  }
  return 0;
}

export function calcSaved(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const available = calcTotal(value.incomes.items);
    const saved = Big(value.stats.goal).mul(available).div(100);
    return roundBig(saved, 2);
  }
  return 0;
}

export function calcAutoGoal(value: Budget | null): number {
  if (value !== null && value.stats.goal !== null && !isNaN(value.stats.goal)) {
    const incomeTotal = calcTotal(value.incomes.items);
    const available = calcAvailable(value);

    if (incomeTotal.gt(0) && available.gt(0)) {
      const autoGoal = available.mul(100).div(incomeTotal);
      return roundBig(autoGoal, 5);
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
        newBudget.expenses.total = roundBig(
          calcTotal(newBudget.expenses.items),
          2
        );
        break;
      case "income":
        newBudget.incomes.items.push(newItemForm);
        newBudget.incomes.total = roundBig(
          calcTotal(newBudget.incomes.items),
          2
        );
        break;
      case "goal":
        newBudget.stats.goal = Number(item.value);
        break;
      case "reserves":
        newBudget.stats.reserves = Number(item.value);
        break;
    }
  });

  newBudget.stats.available = roundBig(calcAvailable(newBudget), 2);
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
