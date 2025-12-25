import { ItemOperationCreatedDomainEvent } from "@guitos/operations/domain/itemOperationCreatedDomainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class ItemOperationCreatedDomainEventSubscriber
  implements DomainEventSubscriber<ItemOperationCreatedDomainEvent>
{
  private expectation:
    | ((actual: ItemOperationCreatedDomainEvent) => void)
    | undefined = undefined;

  name(): string {
    return "execute-action-on-item-operations-created-event";
  }

  subscribedTo(): DomainEventName<ItemOperationCreatedDomainEvent>[] {
    return [ItemOperationCreatedDomainEvent];
  }

  on(actual: ItemOperationCreatedDomainEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(fn: (actual: ItemOperationCreatedDomainEvent) => void): void {
    this.expectation = fn;
  }
}
