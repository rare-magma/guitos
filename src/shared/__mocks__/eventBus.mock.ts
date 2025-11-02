import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";
import type { EventBus } from "@shared/domain/eventBus/eventBus";
import { expect, vi } from "vitest";

export class EventBusMock implements EventBus {
  private mockPublish = vi.fn();
  private mockSubscribe = vi.fn();
  private mockUnsubscribe = vi.fn();

  async publish(events: DomainEvent[]): Promise<void> {
    await this.mockPublish(events);
  }

  subscribe<T extends DomainEvent>(subscriber: DomainEventSubscriber<T>): void {
    this.mockSubscribe(subscriber);
  }

  unsubscribe<T extends DomainEvent>(
    subscriber: DomainEventSubscriber<T>,
  ): void {
    this.mockUnsubscribe(subscriber);
  }

  whenPublishThrowFor(events: DomainEvent[]): void {
    const failingEventIds = events.map((e) => e.eventId);

    this.mockPublish.mockImplementation((evts: DomainEvent[]) => {
      if (evts.some((e) => failingEventIds.includes(e.eventId))) {
        throw new Error("Publish failed");
      }

      return Promise.resolve();
    });
  }

  assertLastPublishedEventIs(expectedEvent: DomainEvent): void {
    const publishSpyCalls = this.mockPublish.mock.calls;
    const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
    const lastPublishedEvent = lastPublishSpyCall[0][0];

    expect(publishSpyCalls.length).toBeGreaterThan(0);

    expect(this.getDataFromDomainEvent(expectedEvent)).toMatchObject(
      this.getDataFromDomainEvent(lastPublishedEvent),
    );
  }

  assertLastPublishedEventsAre(events: DomainEvent[]): void {
    const publishSpyCalls = this.mockPublish.mock.calls;
    const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
    const lastPublishedEvents = lastPublishSpyCall[0];

    expect(publishSpyCalls.length).toBeGreaterThan(0);
    expect(lastPublishedEvents).toHaveLength(events.length);

    lastPublishedEvents.forEach((publishedEvent: DomainEvent, i: number) => {
      const expectedEvent = events[i];

      expect(this.getDataFromDomainEvent(expectedEvent)).toMatchObject(
        this.getDataFromDomainEvent(publishedEvent),
      );
    });
  }

  assertPublishedEventsAre(events: DomainEvent[]): void {
    const { mock } = this.mockPublish;
    const callsArgument = mock.calls.map((c) =>
      this.getDataFromDomainEvent(c[0][0]),
    );

    expect(mock.calls).toHaveLength(events.length);

    for (const e of events) {
      expect(callsArgument).toContainEqual(this.getDataFromDomainEvent(e));
    }
  }

  assertEmptyPublished(): void {
    const publishSpyCalls = this.mockPublish.mock.calls;
    const lastPublishSpyCall = publishSpyCalls[publishSpyCalls.length - 1];
    const lastPublishedEvents = lastPublishSpyCall[0];

    expect(lastPublishedEvents).toHaveLength(0);
  }

  assertNothingPublished(): void {
    const publishSpyCalls = this.mockPublish.mock.calls;

    expect(publishSpyCalls).toHaveLength(0);
  }

  customAssertion(
    nCalls: number,
    assertion: (callsArgs: DomainEvent[][]) => void,
  ): void {
    const publishSpyCalls = this.mockPublish.mock.calls;

    assertion(publishSpyCalls.slice(-nCalls).map((c) => c[0]));
  }

  assertPublishHasBeenCalledTimes(n: number): void {
    expect(this.mockPublish).toHaveBeenCalledTimes(n);
  }

  // biome-ignore lint/suspicious/noExplicitAny: vitest needs it
  private getDataFromDomainEvent(event: DomainEvent): any {
    const { eventId: _, occurredOn: __, ...attributes } = event;

    return attributes;
  }
}
