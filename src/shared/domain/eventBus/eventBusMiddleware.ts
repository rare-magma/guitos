import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";

export interface EventBusMiddleware {
  run(events: DomainEvent[]): Promise<DomainEvent[]>;
}
