import { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";
import { CommandNotRegisteredError } from "@shared/domain/commandBus/commandNotRegisteredError";
import { InMemoryCommandBus } from "@shared/infrastructure/commandBus/inMemoryCommandBus";
import { MultipleCommandHandlersError } from "@shared/infrastructure/commandBus/multipleCommandHandlersError";
import { describe, expect, it } from "vitest";

class UnhandledCommand extends Command {
  static commandName = "unhandled.command";

  constructor() {
    super(UnhandledCommand.commandName);
  }
}

class HandledCommand extends Command {
  static commandName = "handled.command";

  constructor() {
    super(HandledCommand.commandName);
  }
}

class MyCommandHandler implements CommandHandler<HandledCommand> {
  subscribedTo(): HandledCommand {
    return HandledCommand;
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: test
  async handle(_command: HandledCommand): Promise<void> {}
}

class AnotherCommandHandler implements CommandHandler<HandledCommand> {
  subscribedTo(): HandledCommand {
    return HandledCommand;
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: test
  async handle(_command: HandledCommand): Promise<void> {}
}

describe("inMemoryCommandBus", () => {
  describe("dispatch()", () => {
    it("throws an error when no handlers are registered", async () => {
      expect.hasAssertions();

      const unhandledCommand = new UnhandledCommand();
      const commandBus = new InMemoryCommandBus();

      await expect(commandBus.dispatch(unhandledCommand)).rejects.toThrow(
        Error,
      );
    });

    it("throws an error if it dispatches a command without a handler", async () => {
      expect.hasAssertions();

      const unhandledCommand = new UnhandledCommand();
      const commandBus = new InMemoryCommandBus();

      await expect(commandBus.dispatch(unhandledCommand)).rejects.toThrow(
        CommandNotRegisteredError,
      );
    });

    it("accepts a command with a handler", async () => {
      const handledCommand = new HandledCommand();
      const myCommandHandler = new MyCommandHandler();
      const commandBus = new InMemoryCommandBus();

      commandBus.register(myCommandHandler);

      await commandBus.dispatch(handledCommand);
    });
  });

  describe("register()", () => {
    it("should register a command handler", () => {
      const commandHandler = new MyCommandHandler();
      const commandBus = new InMemoryCommandBus();
      expect(() => commandBus.register(commandHandler)).not.toThrow();
    });

    it("should do nothing if a command handler is already registered", () => {
      const commandHandler = new MyCommandHandler();
      const commandBus = new InMemoryCommandBus();
      commandBus.register(commandHandler);
      expect(() => commandBus.register(commandHandler)).not.toThrow();
    });

    it("should throw an error when more than one handler is registered for the same command", () => {
      const commandHandler = new MyCommandHandler();
      const anotherHandler = new AnotherCommandHandler();
      const commandBus = new InMemoryCommandBus();
      commandBus.register(commandHandler);
      expect(() => commandBus.register(anotherHandler)).toThrow(
        MultipleCommandHandlersError,
      );
    });
  });

  describe("unregister()", () => {
    it("should unregister a command handler", () => {
      const commandHandler = new MyCommandHandler();
      const commandBus = new InMemoryCommandBus();
      commandBus.register(commandHandler);
      expect(() => commandBus.unregister(commandHandler)).not.toThrow();
    });

    it("should do nothing when unregistering a command handler that is not registered", () => {
      const commandHandler = new MyCommandHandler();
      const commandBus = new InMemoryCommandBus();
      expect(() => commandBus.unregister(commandHandler)).not.toThrow();
    });
  });
});
