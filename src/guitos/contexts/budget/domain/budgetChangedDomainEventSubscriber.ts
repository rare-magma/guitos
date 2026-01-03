import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class BudgetChangedDomainEventSubscriber
  implements DomainEventSubscriber<BudgetChangedDomainEvent>
{
  private expectation:
    | ((actual: BudgetChangedDomainEvent) => void)
    | undefined = undefined;

  name(): string {
    return "execute-action-on-budget-changed-event";
  }

  subscribedTo(): DomainEventName<BudgetChangedDomainEvent>[] {
    return [BudgetChangedDomainEvent];
  }

  on(actual: BudgetChangedDomainEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(fn: (actual: BudgetChangedDomainEvent) => void): void {
    this.expectation = fn;
  }
}
