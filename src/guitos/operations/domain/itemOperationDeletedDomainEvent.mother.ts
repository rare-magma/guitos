import type { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { ItemOperationDeletedDomainEvent } from "@guitos/operations/domain/itemOperationDeletedDomainEvent";
import type { Primitives } from "@shared/domain/primitives";

export class ItemOperationDeletedDomainEventMother {
  static create(
    params: Primitives<ItemOperation> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new ItemOperationDeletedDomainEvent(params);
  }

  static fromItemOperation(
    aggregate: ItemOperation,
  ): ItemOperationDeletedDomainEvent {
    return ItemOperationDeletedDomainEventMother.create(
      aggregate.toPrimitives(),
    );
  }
}
