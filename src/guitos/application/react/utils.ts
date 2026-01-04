import type { FilteredItem } from "@guitos/application/react/sections/ChartsPage/ChartsPage";
import type { SearchOption } from "@guitos/application/react/sections/NavBar/NavBar";
import { prompt } from "@guitos/application/react/sections/NavBar/prompt";
import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { MathOperation } from "@guitos/contexts/operations/domain/mathOperation";
import type { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import Big from "big.js";

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
  switch (operation.name) {
    case MathOperation.Add.name:
      newValue = newValue.add(changeValue);
      break;
    case MathOperation.Subtract.name:
      newValue = newValue.sub(changeValue);
      break;
    case MathOperation.Multiply.name:
      newValue = newValue.mul(changeValue);
      break;
    case MathOperation.Divide.name:
      newValue = newValue.div(changeValue);
      break;
    default:
      throw new Error(
        `operation not implemented: ${JSON.stringify(operation)}`,
      );
  }
  total = roundBig(newValue, 2);

  if (total >= 0) {
    return total;
  }
  return 0;
}

export function intlFormat(
  amount: number,
  userOptions?: UserPreferences,
): string {
  return userOptions
    ? new Intl.NumberFormat(userOptions?.locale.value, {
        style: "currency",
        currency: userOptions?.currency.value,
        currencyDisplay: "symbol",
      }).format(amount)
    : amount.toString();
}

export function createBudgetNameList(list: Budget[]): SearchOption[] {
  return list.map((b: Budget) => {
    return { id: b.id, item: "", name: b.name.value };
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

export function generatePrompt(jsonFile: string) {
  return `${prompt}
  \`\`\`json
  ${jsonFile}
  \`\`\`
  `;
}
