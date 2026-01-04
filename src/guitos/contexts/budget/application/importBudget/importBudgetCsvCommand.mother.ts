import { ImportBudgetCsvCommand } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommand";
import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class ImportBudgetCsvCommandMother {
  static create(
    params: Primitives<ImportBudgetCsvCommand>,
  ): ImportBudgetCsvCommand {
    return new ImportBudgetCsvCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<ImportBudgetCsvCommand>>,
  ): ImportBudgetCsvCommand {
    return ImportBudgetCsvCommandMother.create({
      name: ImportBudgetCsvCommand.name,
      budgetName: ObjectMother.word(),
      csv: ObjectMother.word(),
      ...overwrites,
    });
  }

  static applyCommand(command: ImportBudgetCsvCommand): Budget {
    return BudgetMother.create({
      ...command,
    });
  }
}
