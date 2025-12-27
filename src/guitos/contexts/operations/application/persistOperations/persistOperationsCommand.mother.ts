import { PersistOperationsCommand } from "@guitos/contexts/operations/application/persistOperations/persistOperationsCommand";
import type { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import { ItemOperationMother } from "@guitos/contexts/operations/domain/itemOperation.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class PersistOperationsCommandMother {
  static create(
    params: Primitives<PersistOperationsCommand>,
  ): PersistOperationsCommand {
    return new PersistOperationsCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<PersistOperationsCommand>>,
  ): PersistOperationsCommand {
    return PersistOperationsCommandMother.create({
      name: PersistOperationsCommand.name,
      id: ObjectMother.uuid().value,
      operations: [ItemOperationMother.random().toPrimitives()],
      ...overwrites,
    });
  }

  static applyCommand(command: PersistOperationsCommand): ItemOperation[] {
    return command.operations.map((itemOperation) => {
      return ItemOperationMother.create(itemOperation);
    });
  }
}
