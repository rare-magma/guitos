import { Budget } from "@guitos/contexts/budget/domain/budget";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type FailImportJsonBudgetDomainEventBody = Readonly<
  Primitives<JsonImportResult> //TODO: model import json errors
>;

export class JsonBudgetImportFailedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.import-json.failed.1";

  readonly body: FailImportJsonBudgetDomainEventBody;

  constructor(
    args: Primitives<JsonImportResult> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      JsonBudgetImportFailedDomainEvent.eventName,
      Budget.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): FailImportJsonBudgetDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: FailImportJsonBudgetDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new JsonBudgetImportFailedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
