import { Budget } from "@guitos/contexts/budget/domain/budget";
import type { JsonImportResult } from "@guitos/contexts/importExport/infrastructure/jsonParseBudgetRepository";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";

type FailImportJsonBudgetDomainEventBody = Readonly<JsonImportResult>;

export class JsonBudgetImportFailedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.import-json.failed.1";

  readonly body: FailImportJsonBudgetDomainEventBody;

  constructor(
    args: JsonImportResult & {
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
