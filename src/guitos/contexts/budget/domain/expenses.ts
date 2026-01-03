import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";

export class Expenses extends AggregateRoot {
  items: BudgetItem[];
  total: number;

  constructor(items: BudgetItem[], total: number) {
    super();

    this.items = items;
    this.total = total;
  }

  static create(): Expenses {
    return new Expenses([], 0);
  }

  toPrimitives(): Primitives<Expenses> {
    return {
      items: this.items.map((item) => item.toPrimitives()),
      total: this.total,
    };
  }
}
