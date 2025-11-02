import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribe<T extends DomainEvent>(subscriber: DomainEventSubscriber<T>): void;
  unsubscribe<T extends DomainEvent>(
    subscriber: DomainEventSubscriber<T>,
  ): void;
}
