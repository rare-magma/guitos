import { CsvBudgetImportFailedDomainEvent } from "@guitos/contexts/importExport/domain/csvBudgetImportFailedDomainEvent";
import type { CsvImportResult } from "@guitos/contexts/importExport/infrastructure/papaparseCsvBudgetRepository";
import type { Primitives } from "@shared/domain/primitives";

export class CsvBudgetImportFailedDomainEventMother {
  static create(
    params: Primitives<CsvImportResult> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new CsvBudgetImportFailedDomainEvent(params);
  }

  static fromBudgetItem(
    aggregate: CsvImportResult,
  ): CsvBudgetImportFailedDomainEvent {
    return CsvBudgetImportFailedDomainEventMother.create(
      aggregate.toPrimitives(),
    );
  }
}
