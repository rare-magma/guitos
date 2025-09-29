import type { Command } from "@shared/domain/commandBus/command";
import type { CommandBus } from "@shared/domain/commandBus/commandBus";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";
import { CommandNotRegisteredError } from "@shared/domain/commandBus/commandNotRegisteredError";
import { MultipleCommandHandlersError } from "@shared/infrastructure/commandBus/multipleCommandHandlersError";

export class InMemoryCommandBus implements CommandBus {
  private readonly handlers: Map<string, CommandHandler<Command>> = new Map();

  async dispatch(command: Command): Promise<void> {
    const handler = this.handlers.get(command.commandName);
    if (!handler) {
      throw new CommandNotRegisteredError(command);
    }
    await handler.handle(command);
  }

  register<C extends Command>(handler: CommandHandler<C>): void {
    const { commandName } = handler.subscribedTo();
    const existingHandler = this.handlers.get(commandName);
    if (existingHandler) {
      if (existingHandler.constructor.name === handler.constructor.name) {
        return;
      }
      throw new MultipleCommandHandlersError(commandName);
    }
    this.handlers.set(commandName, handler);
  }

  unregister<C extends Command>(handler: CommandHandler<C>): void {
    const { commandName } = handler.subscribedTo();
    this.handlers.delete(commandName);
  }
}
