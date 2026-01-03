import type { Budget } from "@guitos/contexts/budget/domain/budget";
import { Command } from "@shared/domain/commandBus/command";
import type { Primitives } from "@shared/domain/primitives";

export class PersistBudgetCommand extends Command {
  static readonly name = "guitos.budget.persist.1";
  readonly budget: Primitives<Budget>;

  constructor(budget: Primitives<Budget>) {
    super(PersistBudgetCommand.name);

    this.budget = budget;
  }
}
