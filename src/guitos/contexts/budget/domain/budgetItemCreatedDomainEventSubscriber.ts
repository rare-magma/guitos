import { BudgetItemCreatedDomainEvent } from "@guitos/contexts/budget/domain/budgetItemCreatedDomainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class BudgetItemCreatedDomainEventSubscriber
  implements DomainEventSubscriber<BudgetItemCreatedDomainEvent>
{
  private expectation:
    | ((actual: BudgetItemCreatedDomainEvent) => void)
    | undefined = undefined;

  name(): string {
    return "execute-action-on-item-operations-created-event";
  }

  subscribedTo(): DomainEventName<BudgetItemCreatedDomainEvent>[] {
    return [BudgetItemCreatedDomainEvent];
  }

  on(actual: BudgetItemCreatedDomainEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(fn: (actual: BudgetItemCreatedDomainEvent) => void): void {
    this.expectation = fn;
  }
}
