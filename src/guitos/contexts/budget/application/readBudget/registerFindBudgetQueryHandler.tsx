import { BudgetFinder } from "@guitos/contexts/budget/application/readBudget/budgetFinder";
import { FindBudgetQueryHandler } from "@guitos/contexts/budget/application/readBudget/findBudgetQueryHandler";
import { localForageBudgetRepository } from "@guitos/contexts/budget/infrastructure/localForageBudgetRepository";
import { queryBus } from "@shared/infrastructure/buses";

export function registerFindBudgetQueryHandler() {
  const queryHandler = new FindBudgetQueryHandler(
    new BudgetFinder(new localForageBudgetRepository()),
  );

  queryBus.register(queryHandler);
}
