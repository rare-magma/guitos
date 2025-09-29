import type { Command } from "@shared/domain/commandBus/command";

export class CommandNotRegisteredError extends Error {
  constructor(command: Command) {
    super(`<${command.commandName}> has no associated command handler`);
  }
}
