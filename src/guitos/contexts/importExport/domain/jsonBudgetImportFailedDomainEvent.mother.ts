import type { Primitives } from "@shared/domain/primitives";

export class JsonBudgetImportFailedDomainEventMother {
  static create(
    params: Primitives<JsonImportResult> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new JsonBudgetImportFailedDomainEvent(params);
  }

  static fromBudgetItem(
    aggregate: JsonImportResult,
  ): JsonBudgetImportFailedDomainEvent {
    return JsonBudgetImportFailedDomainEventMother.create(
      aggregate.toPrimitives(),
    );
  }
}
