import { PersistLastOpenedBudgetCommand } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class PersistLastOpenedBudgetCommandMother {
  static create(
    params: Primitives<PersistLastOpenedBudgetCommand>,
  ): PersistLastOpenedBudgetCommand {
    return new PersistLastOpenedBudgetCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<PersistLastOpenedBudgetCommand>>,
  ): PersistLastOpenedBudgetCommand {
    return PersistLastOpenedBudgetCommandMother.create({
      name: PersistLastOpenedBudgetCommand.name,
      budgetName: ObjectMother.word(),
      ...overwrites,
    });
  }
}
