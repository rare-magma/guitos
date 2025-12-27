import { Command } from "@shared/domain/commandBus/command";

export class RemoveOperationsCommand extends Command {
  static readonly name = "guitos.operations.remove.1";
  readonly id: string;

  constructor({ id }: { id: string }) {
    super(RemoveOperationsCommand.name);

    this.id = id;
  }
}
