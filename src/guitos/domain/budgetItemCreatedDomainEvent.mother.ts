import type { BudgetItem } from "@guitos/domain/budgetItem";
import { BudgetItemCreatedDomainEvent } from "@guitos/domain/budgetItemCreatedDomainEvent";
import type { Primitives } from "@shared/domain/primitives";

export class BudgetItemCreatedDomainEventMother {
  static create(
    params: Primitives<BudgetItem> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new BudgetItemCreatedDomainEvent(params);
  }

  static fromBudgetItem(aggregate: BudgetItem): BudgetItemCreatedDomainEvent {
    return BudgetItemCreatedDomainEventMother.create(aggregate.toPrimitives());
  }
}
