import { RemoveOperationsCommand } from "@guitos/operations/application/removeOperations/removeOperationsCommand";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class RemoveOperationsCommandMother {
  static create(
    params: Primitives<RemoveOperationsCommand>,
  ): RemoveOperationsCommand {
    return new RemoveOperationsCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<RemoveOperationsCommand>>,
  ): RemoveOperationsCommand {
    return RemoveOperationsCommandMother.create({
      name: RemoveOperationsCommand.name,
      id: ObjectMother.uuid().value,
      ...overwrites,
    });
  }
}
