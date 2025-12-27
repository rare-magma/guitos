import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";

export class Expenses {
  items: BudgetItem[];
  total: number;

  constructor(items: BudgetItem[], total: number) {
    this.items = items;
    this.total = total;
  }

  static create(): Expenses {
    return new Expenses([], 0);
  }
}
