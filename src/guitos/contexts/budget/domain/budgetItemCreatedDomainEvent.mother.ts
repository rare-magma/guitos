import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { BudgetItemCreatedDomainEvent } from "@guitos/contexts/budget/domain/budgetItemCreatedDomainEvent";
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
