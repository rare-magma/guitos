import { PersistBudgetCommand } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommand";
import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import type { CommandBus } from "@shared/domain/commandBus/commandBus";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class PersistBudgetOnBudgetChanged
  implements DomainEventSubscriber<BudgetChangedDomainEvent>
{
  private readonly commandBus: CommandBus;

  constructor(commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  name(): string {
    return "persist-budget-on-budget-changed-event";
  }

  subscribedTo(): DomainEventName<BudgetChangedDomainEvent>[] {
    return [BudgetChangedDomainEvent];
  }

  async on(event: BudgetChangedDomainEvent): Promise<void> {
    const command = new PersistBudgetCommand(event.body);
    await this.commandBus.dispatch(command);
  }
}
