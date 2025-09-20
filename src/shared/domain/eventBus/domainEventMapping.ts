import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import type { NewableClass } from "@shared/domain/newableClass";

type DomainEventCtor = NewableClass<DomainEvent> & DomainEventName<DomainEvent>;

type Mapping = Map<string, DomainEventCtor>;

export class DomainEventMapping {
  private mapping: Mapping;

  constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
    this.mapping = DomainEventMapping.formatSubscribers(subscribers);
  }

  private static formatSubscribers(
    subscribers: DomainEventSubscriber<DomainEvent>[],
  ): Mapping {
    const reducer = (
      map: Map<string, DomainEventCtor>,
      subscriber: DomainEventSubscriber<DomainEvent>,
    ) => {
      subscriber.subscribedTo().reduce((acc, domainEventCtor) => {
        const { eventName } = domainEventCtor;
        return acc.set(eventName, domainEventCtor as DomainEventCtor);
      }, map);

      return map;
    };

    return subscribers.reduce(reducer, new Map<string, DomainEventCtor>());
  }

  for(name: string): NewableClass<DomainEvent> {
    const domainEventCtor = this.mapping.get(name);

    if (!domainEventCtor) {
      throw new Error(
        `The Domain Event constructor for ${name} doesn't exist or has no subscribers`,
      );
    }

    return domainEventCtor;
  }
}
