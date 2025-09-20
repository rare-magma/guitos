import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
}
