import { Query } from "@shared/domain/queryBus/query";

export class FindBudgetQuery extends Query {
  static readonly name = "guitos.budget.find.1";
  readonly budgetId: string;

  constructor(budgetId: string) {
    super(FindBudgetQuery.name);

    this.budgetId = budgetId;
  }
}
