import type { Budget } from "@guitos/domain/budget";
import { MathOperation } from "@guitos/operations/domain/mathOperation";
import type { FilteredItem } from "@guitos/sections/ChartsPage/ChartsPage";
import type { SearchOption } from "@guitos/sections/NavBar/NavBar";
import { prompt } from "@guitos/sections/NavBar/prompt";
import type { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import Big from "big.js";
import type { RefObject } from "react";
import type Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";

export function roundBig(number: Big, precision: number): number {
  return Big(number).round(precision, 1).toNumber();
}

export function calc(
  itemValue: number,
  change: number,
  operation: MathOperation,
): number {
  let total = 0;
  const isActionableChange = !Number.isNaN(itemValue) && change > 0;

  if (!isActionableChange) {
    return 0;
  }

  let newValue = Big(itemValue);
  const changeValue = Big(change);
  switch (operation) {
    case MathOperation.Add:
      newValue = newValue.add(changeValue);
      break;
    case MathOperation.Subtract:
      newValue = newValue.sub(changeValue);
      break;
    case MathOperation.Multiply:
      newValue = newValue.mul(changeValue);
      break;
    case MathOperation.Divide:
      newValue = newValue.div(changeValue);
      break;
    default:
      throw new Error("operation not implemented");
  }
  total = roundBig(newValue, 2);

  if (total >= 0) {
    return total;
  }
  return 0;
}

export function intlFormat(
  amount: number,
  userOptions: UserPreferences,
): string {
  return new Intl.NumberFormat(userOptions.locale.value, {
    style: "currency",
    currency: userOptions.currency.value,
    currencyDisplay: "symbol",
  }).format(amount);
}

export function focusRef(ref: RefObject<HTMLInputElement | Typeahead | null>) {
  if (ref.current) {
    ref.current.focus();
  }
}

export function createBudgetNameList(list: Budget[]): SearchOption[] {
  return list
    .filter((b: Budget) => b.id !== undefined && b.name !== undefined)
    .map((b: Budget) => {
      return { id: b.id, item: "", name: b.name };
    });
}

export function parseLocaleNumber(
  stringNumber: string,
  locale: string | undefined,
): number {
  const thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  const decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return Number.parseFloat(
    stringNumber
      .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
      .replace(new RegExp(`\\${decimalSeparator}`), "."),
  );
}

export function median(arr: number[]): number {
  if (!arr.length) return 0;

  const s = [...arr].toSorted((a, b) => Big(a).minus(b).toNumber());
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0
    ? Big(s[mid - 1])
        .plus(s[mid])
        .div(2)
        .toNumber()
    : s[mid];
}

export function getNestedProperty<O, K extends keyof O, L extends keyof O[K]>(
  object: O,
  firstProp: K,
  secondProp: L,
): O[K][L] {
  return object[firstProp][secondProp];
}

export function getNestedValues<T, K extends keyof T, L extends keyof T[K]>(
  list: T[] | undefined,
  prop1: K,
  prop2: L,
): T[K][L][] {
  // biome-ignore lint/style/noNonNullAssertion: for simplicity
  return list!.map((o: T) => {
    return getNestedProperty(o, prop1, prop2);
  });
}

export function getLabelKey(option: unknown): string {
  const label = option as SearchOption;
  return label.item ? `${label.name} ${label.item}` : `${label.name}`;
}

export function getLabelKeyFilteredItem(option: unknown): string {
  const label = option as FilteredItem;
  return `${label.item} (${label.name} ${label.type.toLowerCase()})`;
}

export function saveLastOpenedBudget(
  name: string,
  navigateFn: (string: string) => void,
) {
  navigateFn(`/${name}`);
  localStorage.setItem("guitos_lastOpenedBudget", name);
}

export function generatePrompt(jsonFile: string) {
  return `${prompt}
  \`\`\`json
  ${jsonFile}
  \`\`\`
  `;
}
