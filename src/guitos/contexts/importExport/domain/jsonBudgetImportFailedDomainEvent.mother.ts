import { JsonBudgetImportFailedDomainEvent } from "@guitos/contexts/importExport/domain/jsonBudgetImportFailedDomainEvent";
import type { JsonImportResult } from "@guitos/contexts/importExport/infrastructure/jsonParseBudgetRepository";

export class JsonBudgetImportFailedDomainEventMother {
  static create(
    params: JsonImportResult & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new JsonBudgetImportFailedDomainEvent(params);
  }

  static fromBudgetItem(
    aggregate: JsonImportResult,
  ): JsonBudgetImportFailedDomainEvent {
    return JsonBudgetImportFailedDomainEventMother.create(aggregate);
  }
}
