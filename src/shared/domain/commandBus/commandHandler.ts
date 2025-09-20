import type { Command } from "@shared/domain/commandBus/command";

export interface CommandHandler<T extends Command> {
  subscribedTo(): Command;
  handle(command: T): Promise<void>;
}
