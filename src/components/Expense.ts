import { ItemForm } from "./ItemForm";

export class Expense {
  items: Array<ItemForm> = [];
  total = 0;

  constructor(initializer?: Expense) {
    if (!initializer) return;
    if (initializer.items) this.items = initializer.items;
    if (initializer.total) this.total = initializer.total;
  }
}
