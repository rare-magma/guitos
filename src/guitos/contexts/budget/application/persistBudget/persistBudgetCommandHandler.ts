import type { BudgetPersister } from "@guitos/contexts/budget/application/persistBudget/budgetPersister";
import { PersistBudgetCommand } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommand";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class PersistBudgetCommandHandler
  implements CommandHandler<PersistBudgetCommand>
{
  private persister: BudgetPersister;

  constructor(persister: BudgetPersister) {
    this.persister = persister;
  }

  subscribedTo(): Command {
    return PersistBudgetCommand;
  }

  handle(command: PersistBudgetCommand): Promise<void> {
    return Promise.resolve(this.persister.run(command));
  }
}
