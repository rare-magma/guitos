export class MultipleCommandHandlersError extends Error {
  constructor(commandName: string) {
    super(
      `Multiple handlers registered for command ${commandName}. Each command can only have one handler.`,
    );
  }
}
