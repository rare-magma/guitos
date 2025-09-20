import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import type { EventBus } from "@shared/domain/eventBus/eventBus";
import { EventEmitterBus } from "@shared/infrastructure/eventBus/eventEmitterBus";

export class InMemoryAsyncEventBus implements EventBus {
  private bus?: EventEmitterBus;

  registerSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
    this.bus = new EventEmitterBus(subscribers);
  }

  publish(events: DomainEvent[]): Promise<void> {
    if (!this.bus) {
      return Promise.reject(new Error("No event subscribers registered"));
    }

    this.bus.publish(events);
    return Promise.resolve();
  }
}
