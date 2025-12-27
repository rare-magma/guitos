import { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type DeleteItemOperationDomainEventBody = Readonly<Primitives<ItemOperation>>;

export class ItemOperationDeletedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.item-operation.deleted.1";

  readonly body: DeleteItemOperationDomainEventBody;

  constructor(
    args: Primitives<ItemOperation> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      ItemOperationDeletedDomainEvent.eventName,
      ItemOperation.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): DeleteItemOperationDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: DeleteItemOperationDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new ItemOperationDeletedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
