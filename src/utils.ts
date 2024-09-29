import Big from "big.js";
import type { MutableRefObject } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { FilteredItem } from "./guitos/sections/ChartsPage/ChartsPage";
import type { SearchOption } from "./guitos/sections/NavBar/NavBar";
import type { Budget } from "./guitos/domain/budget";
import type { ItemOperation } from "./guitos/domain/calculationHistoryItem";
import { currenciesMap } from "./lists/currenciesMap";

export const userLang = navigator.language;

export function getCountryCode(locale: string): string {
  return locale.split("-").length >= 2
    ? locale.split("-")[1].toUpperCase()
    : locale.toUpperCase();
}

export function getCurrencyCode(country: string): string {
  const countryIsInMap =
    currenciesMap[country as keyof typeof currenciesMap] !== undefined;

  if (countryIsInMap) {
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

export function calc(
  itemValue: number,
  change: number,
  operation: ItemOperation,
): number {
  let total = 0;
  const isActionableChange = !Number.isNaN(itemValue) && change > 0;

  if (isActionableChange) {
    let newValue = Big(itemValue);
    const changeValue = Big(change);
    switch (operation) {
      case "add":
        newValue = newValue.add(changeValue);
        break;
      case "subtract":
        newValue = newValue.sub(changeValue);
        break;
      case "multiply":
        newValue = newValue.mul(changeValue);
        break;
      case "divide":
        newValue = newValue.div(changeValue);
        break;
      default:
        throw new Error("operation not implemented");
    }
    total = roundBig(newValue, 2);
  }

  if (total >= 0) {
    return total;
  }
  return 0;
}

export function intlFormat(amount: number, currencyCode: string) {
  return new Intl.NumberFormat(userLang, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "symbol",
  }).format(amount);
}

export function focusRef(ref: MutableRefObject<HTMLInputElement | undefined>) {
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

  const s = [...arr].sort((a, b) => Big(a).minus(b).toNumber());
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
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
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
  navigateFn: NavigateFunction,
) {
  navigateFn(`/${name}`);
  localStorage.setItem("guitos_lastOpenedBudget", name);
}
