import { useState, useEffect } from "react";
import { ItemForm } from "./components/ItemForm";

export function calcTotal(values: Array<ItemForm>): string {
  return values
    .filter((x) => !isNaN(x.value))
    .reduce((total, n) => total + n.value, 0)
    .toString();
}

export function getStorageValue(key: string, defaultValue: string) {
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
