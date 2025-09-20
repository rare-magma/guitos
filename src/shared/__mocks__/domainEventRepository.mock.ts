import type { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { DomainEventRepository } from "@shared/domain/eventBus/domainEventRepository";
import { expect, vi } from "vitest";

export class DomainEventRepositoryMock implements DomainEventRepository {
  private mockSave = vi.fn();

  async save(events: DomainEvent | DomainEvent[]): Promise<void> {
    await this.mockSave(events);
  }

  assertSaveHasBeenWith(events: DomainEvent[]): void {
    const { mock } = this.mockSave;
    const actualSavedEvents = mock.calls.flatMap((c) => c[0]);

    expect(mock.calls).toHaveLength(events.length);

    for (const e of events) {
      expect(actualSavedEvents).toContainEqual(e);
    }
  }

  assertNothingSaved(): void {
    expect(this.mockSave).not.toHaveBeenCalled();
  }
}
