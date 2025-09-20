import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";

export interface DomainEventSubscriber<T extends DomainEvent> {
  name(): string;
  subscribedTo(): DomainEventName<T>[];
  on(domainEvent: T): Promise<void>;
}
