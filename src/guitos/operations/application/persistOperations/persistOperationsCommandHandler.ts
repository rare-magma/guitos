import type { OperationsPersister } from "@guitos/operations/application/persistOperations/operationsPersister";
import { PersistOperationsCommand } from "@guitos/operations/application/persistOperations/persistOperationsCommand";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class PersistOperationsCommandHandler
  implements CommandHandler<PersistOperationsCommand>
{
  private persister: OperationsPersister;

  constructor(persister: OperationsPersister) {
    this.persister = persister;
  }

  subscribedTo(): Command {
    return PersistOperationsCommand;
  }

  async handle(command: PersistOperationsCommand): Promise<void> {
    await this.persister.run(command);
  }
}
