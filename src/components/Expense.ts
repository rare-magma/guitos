import { ItemForm } from "./ItemForm";

export class Expense {
  id!: string;
  items: Array<ItemForm> = [];
  total = 0;
  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: Expense) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.items) this.items = initializer.items;
    if (initializer.total) this.total = initializer.total;
  }
}
