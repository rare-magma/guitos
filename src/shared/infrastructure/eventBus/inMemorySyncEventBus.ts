import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import type { EventBus } from "@shared/domain/eventBus/eventBus";

export class InMemorySyncEventBus implements EventBus {
  private readonly subscriptions: Map<
    string,
    DomainEventSubscriber<DomainEvent>[]
  > = new Map();

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const subscribers = this.subscriptions.get(event.eventName);

      if (!subscribers) {
        continue;
      }

      for (const subscriber of subscribers) {
        try {
          await subscriber.on(event);
        } catch (error) {
          console.error(error);
        }
      }
    }
    return Promise.resolve();
  }

  subscribe<T extends DomainEvent>(subscriber: DomainEventSubscriber<T>): void {
    const subscribedEvents = subscriber.subscribedTo();

    for (const event of subscribedEvents) {
      const subscribers = this.subscriptions.get(event.eventName) ?? [];

      subscribers?.push(subscriber);
      this.subscriptions.set(event.eventName, subscribers);
    }
  }

  unsubscribe<T extends DomainEvent>(
    subscriber: DomainEventSubscriber<T>,
  ): void {
    const subscribedEvents = subscriber.subscribedTo();

    for (const event of subscribedEvents) {
      const subscribers = this.subscriptions.get(event.eventName);

      if (!subscribers) {
        continue;
      }

      const index = subscribers.indexOf(subscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    }
  }
}
