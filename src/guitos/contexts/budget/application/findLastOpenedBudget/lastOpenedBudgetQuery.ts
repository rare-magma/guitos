import { Query } from "@shared/domain/queryBus/query";

export class LastOpenedBudgetQuery extends Query {
  static readonly name = "guitos.lastopenedbudget.find.1";
  constructor() {
    super(LastOpenedBudgetQuery.name);
  }
}
