import { ItemForm } from "./components/ItemForm/ItemForm";
import { currenciesMap } from "./lists/currenciesMap";
import { MutableRefObject } from "react";
import Big from "big.js";
import { Budget } from "./components/Budget/Budget";
import { CsvItem } from "./components/Budget/CsvItem";

export const userLang = navigator.language;

export function getCountryCode(locale: string): string {
  return locale.split("-").length >= 2
    ? locale.split("-")[1].toUpperCase()
    : locale.toUpperCase();
}

export function getCurrencyCode(country: string): string {
  if (currenciesMap[country as keyof typeof currenciesMap] !== undefined) {
    return currenciesMap[
      country as keyof typeof currenciesMap
    ] as unknown as string;
  }
  return "USD";
}

export const countryCode = getCountryCode(userLang);
export const initialCurrencyCode = getCurrencyCode(countryCode);

export function roundBig(number: Big, precision: number): number {
  return Big(number).round(precision, 1).toNumber();
}

export function calcTotal(values: Array<ItemForm>): Big {
  let total = Big(0);
  values &&
    values
      .filter((x) => !isNaN(x.value))
      .forEach((i) => (total = total.add(Big(i.value))));
  return total;
}

export function calcPercentage(
  itemValue: number,
  revenueTotal: number
): number {
  if (!isNaN(revenueTotal) && revenueTotal > 0 && !isNaN(itemValue)) {
    const percentage = Big(itemValue).mul(100).div(revenueTotal);

    return roundBig(percentage, percentage.gte(1) ? 0 : 1);
  }
  return 0;
}

export function calc(
  itemValue: number,
  change: number,
  operation: string
): number {
  let total = 0;
  if (!isNaN(itemValue) && change > 0) {
    let newValue = Big(itemValue);
    const changeValue = Big(change);
    switch (operation) {
      case "add":
        newValue = newValue.add(changeValue);
        break;
      case "sub":
        newValue = newValue.sub(changeValue);
        break;
      case "mul":
        newValue = newValue.mul(changeValue);
        break;
      case "div":
        newValue = newValue.div(changeValue);
        break;
      default:
        throw new Error("operation not implemented");
    }
    total = roundBig(newValue, 2);
  }

  if (total >= 0) {
    return total;
  } else {
    return 0;
  }
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
  const year = new Date().getFullYear();
  const newBudget = {
    id: newId,
    name: `${year}-${newId.slice(0, 8)}`,
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

export function intlFormat(amount: number, currencyCode: string) {
  return new Intl.NumberFormat(userLang, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "symbol",
  }).format(amount);
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

export function parseLocaleNumber(
  stringNumber: string,
  locale: string | undefined
): number {
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
}

export function budgetToCsv(budget: Budget) {
  const header = ["type", "name", "value"];

  const expenses = budget.expenses.items.map((expense) => {
    return ["expense", expense.name, expense.value].join(",");
  });

  const incomes = budget.incomes.items.map((income) => {
    return ["income", income.name, income.value].join(",");
  });

  const stats = ["goal", "goal", budget.stats.goal.toString()].join(",");
  const reserves = [
    "reserves",
    "reserves",
    budget.stats.reserves.toString(),
  ].join(",");

  return [header, ...expenses, ...incomes, stats, reserves].join("\n");
}

export const median = (arr: number[]): number => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
};
