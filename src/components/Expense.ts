import { ItemForm } from "./ItemForm";

export class Expense {
  id!: number;
  expenses: Array<ItemForm> = [];
  total = 0;
  get isNew(): boolean {
    return this.id === undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.expenses) this.expenses = initializer.expenses;
    if (initializer.total) this.total = initializer.total;
  }
}
