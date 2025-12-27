import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";

export class Incomes {
  items: BudgetItem[];
  total: number;

  constructor(items: BudgetItem[], total: number) {
    this.items = items;
    this.total = total;
  }

  static create(): Incomes {
    return new Incomes([], 0);
  }
}
