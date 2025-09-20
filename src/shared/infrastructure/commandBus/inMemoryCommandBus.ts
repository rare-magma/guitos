import type { Command } from "@shared/domain/commandBus/command";
import type { CommandBus } from "@shared/domain/commandBus/commandBus";
import type { CommandHandlersInformation } from "@shared/infrastructure/commandBus/commandHandlersInformation";

export class InMemoryCommandBus implements CommandBus {
  private commandHandlersInformation?: CommandHandlersInformation;

  registerHandlers(
    commandHandlersInformation: CommandHandlersInformation,
  ): void {
    this.commandHandlersInformation = commandHandlersInformation;
  }

  async dispatch(command: Command): Promise<void> {
    if (!this.commandHandlersInformation) {
      throw new Error("No command handlers registered");
    }

    const handler = this.commandHandlersInformation.search(command);

    await handler.handle(command);
  }
}
