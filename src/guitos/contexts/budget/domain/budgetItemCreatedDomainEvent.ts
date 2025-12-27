import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type CreateBudgetItemDomainEventBody = Readonly<Primitives<BudgetItem>>;

export class BudgetItemCreatedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.budget-item.created.1";

  readonly body: CreateBudgetItemDomainEventBody;

  constructor(
    args: Primitives<BudgetItem> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      BudgetItemCreatedDomainEvent.eventName,
      BudgetItem.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): CreateBudgetItemDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: CreateBudgetItemDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new BudgetItemCreatedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
