import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";

export type DomainEventName<T extends DomainEvent> = Pick<T, "eventName">;
