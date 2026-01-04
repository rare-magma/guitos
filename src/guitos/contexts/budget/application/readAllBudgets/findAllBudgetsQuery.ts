import { Query } from "@shared/domain/queryBus/query";

export class FindAllBudgetsQuery extends Query {
  static readonly name = "guitos.budget.findall.1";

  constructor() {
    super(FindAllBudgetsQuery.name);
  }
}
