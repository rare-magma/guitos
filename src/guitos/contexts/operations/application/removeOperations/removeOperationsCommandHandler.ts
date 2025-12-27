import type { OperationsRemover } from "@guitos/contexts/operations/application/removeOperations/operationsRemover";
import { RemoveOperationsCommand } from "@guitos/contexts/operations/application/removeOperations/removeOperationsCommand";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class RemoveOperationsCommandHandler
  implements CommandHandler<RemoveOperationsCommand>
{
  private remover: OperationsRemover;

  constructor(remover: OperationsRemover) {
    this.remover = remover;
  }

  subscribedTo(): Command {
    return RemoveOperationsCommand;
  }

  async handle(command: RemoveOperationsCommand): Promise<void> {
    await this.remover.run(command);
  }
}
