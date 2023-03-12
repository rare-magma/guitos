import { Expense } from "./Expense";
import { Income } from "./Income";
import { Stat } from "./Stat";

export class Budget {
  version!: number;
  name!: string;
  expenses!: Expense;
  incomes!: Income;
  stats!: Stat;
  get isNew(): boolean {
    return this.name === undefined;
  }

  constructor(initializer?: Budget) {
    if (!initializer) return;
    if (initializer.version) this.version = initializer.version;
    if (initializer.name) this.name = initializer.name;
    if (initializer.expenses) this.expenses = initializer.expenses;
    if (initializer.incomes) this.incomes = initializer.incomes;
    if (initializer.stats) this.stats = initializer.stats;
  }
}
