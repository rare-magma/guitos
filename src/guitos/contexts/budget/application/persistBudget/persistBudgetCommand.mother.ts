import { PersistBudgetCommand } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommand";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import type { Primitives } from "@shared/domain/primitives";

export class PersistBudgetCommandMother {
  static create(
    params: Primitives<PersistBudgetCommand>,
  ): PersistBudgetCommand {
    return new PersistBudgetCommand(params.budget);
  }

  static random(
    overwrites?: Partial<Primitives<PersistBudgetCommand>>,
  ): PersistBudgetCommand {
    return PersistBudgetCommandMother.create({
      name: PersistBudgetCommand.name,
      budget: BudgetMother.random().toPrimitives(),
      ...overwrites,
    });
  }
}
