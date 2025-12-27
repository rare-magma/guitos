import { Command } from "@shared/domain/commandBus/command";

export class PersistLastOpenedBudgetCommand extends Command {
  static readonly name = "guitos.lastopenedbudget.persist.1";
  readonly budgetName: string;

  constructor({ budgetName }: { budgetName: string }) {
    super(PersistLastOpenedBudgetCommand.name);

    this.budgetName = budgetName;
  }
}
