import { ItemForm } from "./ItemForm";

export class Income {
  id!: number;
  incomes: Array<ItemForm> = [];
  total = 0;
  get isNew(): boolean {
    return this.id === undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.incomes) this.incomes = initializer.incomes;
    if (initializer.total) this.total = initializer.total;
  }
}
