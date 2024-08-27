import BudgetItem from "./budgetItem";

export default class Expenses {
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
