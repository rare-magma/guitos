import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";

export interface DomainEventRepository {
  save(events: DomainEvent | DomainEvent[]): Promise<void>;
}
