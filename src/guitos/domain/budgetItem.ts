import { BudgetItemCreatedDomainEvent } from "@guitos/domain/budgetItemCreatedDomainEvent";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";
import Big from "big.js";
import { roundBig } from "../application/react/utils";

export class BudgetItem extends AggregateRoot {
  id: number;
  name: string;
  value: number;

  constructor(id: number, name: string, value: number) {
    super();

    this.id = id;
    this.name = name;
    this.value = value;
  }

  static create(): BudgetItem {
    const newBudgetItem = new BudgetItem(1, "", 0);
    newBudgetItem.record(
      new BudgetItemCreatedDomainEvent(newBudgetItem.toPrimitives()),
    );
    return new BudgetItem(1, "", 0);
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
      value: this.value,
    };
  }
}
