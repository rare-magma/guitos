import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export interface CommandBus {
  dispatch<C extends Command>(command: C): Promise<void>;
  register<C extends Command>(commandHandler: CommandHandler<C>): void;
  unregister<C extends Command>(commandHandler: CommandHandler<C>): void;
}
