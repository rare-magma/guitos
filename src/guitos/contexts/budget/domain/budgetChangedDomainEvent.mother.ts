import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import type { Primitives } from "@shared/domain/primitives";

export class BudgetChangedDomainEventMother {
  static create(
    params: Primitives<Budget> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new BudgetChangedDomainEvent(params);
  }

  static fromBudget(aggregate: Budget): BudgetChangedDomainEvent {
    return BudgetChangedDomainEventMother.create(aggregate.toPrimitives());
  }
}
