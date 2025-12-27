import { ItemOperationDeletedDomainEvent } from "@guitos/operations/domain/itemOperationDeletedDomainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class ItemOperationDeletedDomainEventSubscriber
  implements DomainEventSubscriber<ItemOperationDeletedDomainEvent>
{
  private expectation:
    | ((actual: ItemOperationDeletedDomainEvent) => void)
    | undefined = undefined;

  name(): string {
    return "execute-action-on-item-operations-deleted-event";
  }

  subscribedTo(): DomainEventName<ItemOperationDeletedDomainEvent>[] {
    return [ItemOperationDeletedDomainEvent];
  }

  on(actual: ItemOperationDeletedDomainEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(fn: (actual: ItemOperationDeletedDomainEvent) => void): void {
    this.expectation = fn;
  }
}
