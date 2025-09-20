import { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";
import { CommandNotRegisteredError } from "@shared/domain/commandBus/commandNotRegisteredError";
import { CommandHandlersInformation } from "@shared/infrastructure/commandBus/commandHandlersInformation";
import { InMemoryCommandBus } from "@shared/infrastructure/commandBus/inMemoryCommandBus";
import { describe, expect, it } from "vitest";

class UnhandledCommand extends Command {
  static COMMAND_NAME = "unhandled.command";
}

class HandledCommand extends Command {
  static COMMAND_NAME = "handled.command";
}

class MyCommandHandler implements CommandHandler<HandledCommand> {
  subscribedTo(): HandledCommand {
    return HandledCommand;
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: test
  async handle(_command: HandledCommand): Promise<void> {}
}

describe("inMemoryCommandBus", () => {
  it("throws an error when no handlers are registered", async () => {
    expect.hasAssertions();

    const unhandledCommand = new UnhandledCommand();
    const commandBus = new InMemoryCommandBus();

    await expect(commandBus.dispatch(unhandledCommand)).rejects.toThrow(Error);
  });

  it("throws an error if it dispatches a command without a handler", async () => {
    expect.hasAssertions();

    const unhandledCommand = new UnhandledCommand();
    const commandHandlersInformation = new CommandHandlersInformation([]);
    const commandBus = new InMemoryCommandBus();

    commandBus.registerHandlers(commandHandlersInformation);

    await expect(commandBus.dispatch(unhandledCommand)).rejects.toThrow(
      CommandNotRegisteredError,
    );
  });

  it("accepts a command with a handler", async () => {
    const handledCommand = new HandledCommand();
    const myCommandHandler = new MyCommandHandler();
    const commandHandlersInformation = new CommandHandlersInformation([
      myCommandHandler,
    ]);
    const commandBus = new InMemoryCommandBus();

    commandBus.registerHandlers(commandHandlersInformation);

    await commandBus.dispatch(handledCommand);
  });
});
