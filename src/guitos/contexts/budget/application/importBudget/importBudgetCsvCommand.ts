import { Command } from "@shared/domain/commandBus/command";

export class ImportBudgetCsvCommand extends Command {
  static readonly name = "guitos.budget.import-csv.1";
  readonly budgetName: string;
  readonly csv: string;

  constructor({ budgetName, csv }: { budgetName: string; csv: string }) {
    super(ImportBudgetCsvCommand.name);

    this.budgetName = budgetName;
    this.csv = csv;
  }
}
