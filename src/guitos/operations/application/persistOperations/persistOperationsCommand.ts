import type { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { Command } from "@shared/domain/commandBus/command";
import type { Primitives } from "@shared/domain/primitives";

export class PersistOperationsCommand extends Command {
  static readonly name = "guitos.operations.persist.1";
  readonly id: string;
  readonly operations: Primitives<ItemOperation>[];

  constructor({
    id,
    operations,
  }: { id: string; operations: Primitives<ItemOperation>[] }) {
    super(PersistOperationsCommand.name);

    this.id = id;
    this.operations = operations;
  }
}
