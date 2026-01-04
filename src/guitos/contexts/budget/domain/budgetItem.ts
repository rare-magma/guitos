import { roundBig } from "@guitos/application/react/utils";
import { BudgetItemCreatedDomainEvent } from "@guitos/contexts/budget/domain/budgetItemCreatedDomainEvent";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";
import Big from "big.js";

export class BudgetItem extends AggregateRoot {
  id: number;
  name: string;
  amount: number;
  value?: number; // deprecated field

  constructor({ id, name, amount, value }: Primitives<BudgetItem>) {
    super();

    this.id = id;
    this.name = name;
    this.amount = amount ?? value;
  }

  static create(): BudgetItem {
    const newBudgetItem = new BudgetItem({ id: 1, name: "", amount: 0 });
    newBudgetItem.record(
      new BudgetItemCreatedDomainEvent(newBudgetItem.toPrimitives()),
    );
    return newBudgetItem;
  }

  static percentage(itemValue: number, revenueTotal: number): number {
    if (!itemValue) return 0;
    const canRoundNumbers =
      !Number.isNaN(revenueTotal) &&
      revenueTotal > 0 &&
      !Number.isNaN(itemValue);
    if (!canRoundNumbers) {
      return 0;
    }
    const percentageOfTotal = Big(itemValue).mul(100).div(revenueTotal);
    return roundBig(percentageOfTotal, percentageOfTotal.gte(1) ? 0 : 1);
  }

  toPrimitives(): Primitives<BudgetItem> {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
    };
  }
}
