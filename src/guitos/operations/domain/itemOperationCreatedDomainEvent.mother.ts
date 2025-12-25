import type { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { ItemOperationCreatedDomainEvent } from "@guitos/operations/domain/itemOperationCreatedDomainEvent";
import type { Primitives } from "@shared/domain/primitives";

export class ItemOperationCreatedDomainEventMother {
  static create(
    params: Primitives<ItemOperation> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new ItemOperationCreatedDomainEvent(params);
  }

  static fromItemOperation(
    aggregate: ItemOperation,
  ): ItemOperationCreatedDomainEvent {
    return ItemOperationCreatedDomainEventMother.create(
      aggregate.toPrimitives(),
    );
  }
}
