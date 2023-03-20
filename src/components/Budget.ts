import { Expense } from "./Expense";
import { Income } from "./Income";
import { Stat } from "./Stat";

export class Budget {
  id!: string;
  name!: string;
  expenses!: Expense;
  incomes!: Income;
  stats!: Stat;

  constructor(initializer?: Budget) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.expenses) this.expenses = initializer.expenses;
    if (initializer.incomes) this.incomes = initializer.incomes;
    if (initializer.stats) this.stats = initializer.stats;
  }
}
