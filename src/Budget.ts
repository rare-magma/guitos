import ItemForm from "./ItemForm";
import Stats from "./Stats";

export class Budget {
  id: number | undefined;
  name!: string;
  expenses: ItemForm[] = [];
  incomes: ItemForm[] = [];
  stats: Stats | undefined;
  total = 0;
  get isNew(): boolean {
    return this.id === undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.expenses) this.expenses = initializer.expenses;
    if (initializer.incomes) this.incomes = initializer.incomes;
    if (initializer.stats) this.stats = initializer.stats;
    if (initializer.total) this.total = initializer.total;
  }
}

export default Budget;
