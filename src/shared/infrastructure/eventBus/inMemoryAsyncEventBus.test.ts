import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import { InMemoryAsyncEventBus } from "@shared/infrastructure/eventBus/inMemoryAsyncEventBus";
import { describe, expect, it } from "vitest";

class ExampleEvent extends DomainEvent {
  static eventName = "example:event";

  constructor(
    args: { id: string } & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    super(ExampleEvent.eventName, args.id, args.eventId, args.occurredOn);
  }

  toPrimitives(): Record<string, unknown> {
    return {};
  }
}

class DomainEventSubscriberExample
  implements DomainEventSubscriber<ExampleEvent>
{
  private expectation: ((actual: ExampleEvent) => void) | undefined = undefined;

  name(): string {
    throw new Error("Method not implemented.");
  }

  subscribedTo(): DomainEventName<ExampleEvent>[] {
    return [ExampleEvent];
  }

  on(actual: ExampleEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(fn: (actual: ExampleEvent) => void): void {
    this.expectation = fn;
  }
}

describe("inMemoryAsyncEventBus", () => {
  it("throws an error when no subscribers are registered", async () => {
    expect.hasAssertions();

    const event = new ExampleEvent({ id: ObjectMother.uuid().value });
    const eventBus = new InMemoryAsyncEventBus();

    await expect(eventBus.publish([event])).rejects.toThrow(Error);
  });

  it("the subscriber should be called when the event it is subscribed to is published", async () => {
    expect.assertions(1);

    const event = new ExampleEvent({ id: ObjectMother.uuid().value });
    const subscriber = new DomainEventSubscriberExample();
    const eventBus = new InMemoryAsyncEventBus();

    eventBus.registerSubscribers([subscriber]);

    subscriber.setExpectation((actual: ExampleEvent) => {
      expect(actual).toStrictEqual(event);
    });

    await eventBus.publish([event]);
  });
});
