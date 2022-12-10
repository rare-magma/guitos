import { ItemForm } from "./components/ItemForm";

export function calcTotal(values: Array<ItemForm>): string {
  return values.reduce((total, n) => total + n.value, 0).toString();
}
