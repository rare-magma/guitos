import { Command } from "@shared/domain/commandBus/command";

export class ImportBudgetJsonCommand extends Command {
  static readonly name = "guitos.budget.import-json.1";
  readonly budgetName: string;
  readonly json: string;

  constructor({ budgetName, json }: { budgetName: string; json: string }) {
    super(ImportBudgetJsonCommand.name);

    this.budgetName = budgetName;
    this.json = json;
  }
}
