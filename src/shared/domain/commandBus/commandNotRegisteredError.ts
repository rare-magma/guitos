import type { Command } from "@shared/domain/commandBus/command";

export class CommandNotRegisteredError extends Error {
  constructor(command: Command) {
    super(`<${command.name}> has no associated command handler`);
  }
}
