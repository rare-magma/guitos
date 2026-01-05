import { Budget } from "@guitos/contexts/budget/domain/budget";
import type { CsvImportResult } from "@guitos/contexts/importExport/infrastructure/papaparseCsvBudgetRepository";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type FailImportCsvBudgetDomainEventBody = Readonly<Primitives<CsvImportResult>>; //TODO: model import csv errors

export class CsvBudgetImportFailedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.import-csv.failed.1";

  readonly body: FailImportCsvBudgetDomainEventBody;

  constructor(
    args: Primitives<CsvImportResult> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      CsvBudgetImportFailedDomainEvent.eventName,
      Budget.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): FailImportCsvBudgetDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: FailImportCsvBudgetDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new CsvBudgetImportFailedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
