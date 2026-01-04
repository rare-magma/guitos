import type { BudgetsFinder } from "@guitos/contexts/budget/application/readAllBudgets/allBudgetsFinder";
import { FindAllBudgetsQuery } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQuery";
import type { FindAllBudgetsResponse } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";

export class FindAllBudgetsQueryHandler
  implements QueryHandler<FindAllBudgetsQuery, FindAllBudgetsResponse>
{
  private readonly finder: BudgetsFinder;

  constructor(finder: BudgetsFinder) {
    this.finder = finder;
  }

  subscribedTo(): FindAllBudgetsQuery {
    return FindAllBudgetsQuery;
  }

  handle(query: FindAllBudgetsQuery): Promise<FindAllBudgetsResponse> {
    const response = this.finder.run(query);
    return Promise.resolve(response);
  }
}
