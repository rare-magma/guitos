import type { LastOpenedBudgetPersister } from "@guitos/contexts/budget/application/saveLastOpenedBudget/lastOpenedBudgetPersister";
import { PersistLastOpenedBudgetCommand } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class PersistLastOpenedBudgetCommandHandler
  implements CommandHandler<PersistLastOpenedBudgetCommand>
{
  private persister: LastOpenedBudgetPersister;

  constructor(persister: LastOpenedBudgetPersister) {
    this.persister = persister;
  }

  subscribedTo(): Command {
    return PersistLastOpenedBudgetCommand;
  }

  handle(command: PersistLastOpenedBudgetCommand): Promise<void> {
    return Promise.resolve(this.persister.run(command));
  }
}
