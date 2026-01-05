import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { ImportBudgetJsonCommand } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommand";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class ImportBudgetJsonCommandMother {
  static create(
    params: Primitives<ImportBudgetJsonCommand>,
  ): ImportBudgetJsonCommand {
    return new ImportBudgetJsonCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<ImportBudgetJsonCommand>>,
  ): ImportBudgetJsonCommand {
    return ImportBudgetJsonCommandMother.create({
      name: ImportBudgetJsonCommand.name,
      budgetName: ObjectMother.word(),
      json: ObjectMother.word(),
      ...overwrites,
    });
  }

  static applyCommand(command: ImportBudgetJsonCommand): Budget {
    return BudgetMother.create({
      ...command,
    });
  }
}
