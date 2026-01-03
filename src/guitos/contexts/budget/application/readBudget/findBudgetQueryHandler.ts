import type { BudgetFinder } from "@guitos/contexts/budget/application/readBudget/budgetFinder";
import { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import type { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";

export class FindBudgetQueryHandler
  implements QueryHandler<FindBudgetQuery, FindBudgetResponse>
{
  private readonly finder: BudgetFinder;

  constructor(finder: BudgetFinder) {
    this.finder = finder;
  }

  subscribedTo(): FindBudgetQuery {
    return FindBudgetQuery;
  }

  handle(query: FindBudgetQuery): Promise<FindBudgetResponse> {
    const response = this.finder.run(query);
    return Promise.resolve(response);
  }
}
