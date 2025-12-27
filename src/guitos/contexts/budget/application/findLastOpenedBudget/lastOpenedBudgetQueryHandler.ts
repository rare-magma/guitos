import type { LastOpenedBudgetFinder } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetFinder";
import { LastOpenedBudgetQuery } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQuery";
import type { LastOpenedBudgetResponse } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";

export class LastOpenedBudgetQueryHandler
  implements QueryHandler<LastOpenedBudgetQuery, LastOpenedBudgetResponse>
{
  private readonly finder: LastOpenedBudgetFinder;

  constructor(finder: LastOpenedBudgetFinder) {
    this.finder = finder;
  }

  subscribedTo(): LastOpenedBudgetQuery {
    return LastOpenedBudgetQuery;
  }

  handle(query: LastOpenedBudgetQuery): Promise<LastOpenedBudgetResponse> {
    const response = this.finder.run(query);
    return Promise.resolve(response);
  }
}
