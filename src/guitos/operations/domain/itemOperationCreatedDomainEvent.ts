import { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type CreateItemOperationDomainEventBody = Readonly<Primitives<ItemOperation>>;

export class ItemOperationCreatedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.item-operation.created.1";

  readonly body: CreateItemOperationDomainEventBody;

  constructor(
    args: Primitives<ItemOperation> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      ItemOperationCreatedDomainEvent.eventName,
      ItemOperation.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): CreateItemOperationDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: CreateItemOperationDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new ItemOperationCreatedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
