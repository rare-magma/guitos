import { Budget } from "@guitos/contexts/budget/domain/budget";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type ChangeBudgetDomainEventBody = Readonly<Primitives<Budget>>;

export class BudgetChangedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.budget.changed.1";

  readonly body: ChangeBudgetDomainEventBody;

  constructor(
    args: Primitives<Budget> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(BudgetChangedDomainEvent.eventName, Budget.name, eventId, occurredOn);

    this.body = body;
  }

  toPrimitives(): ChangeBudgetDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: ChangeBudgetDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new BudgetChangedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
