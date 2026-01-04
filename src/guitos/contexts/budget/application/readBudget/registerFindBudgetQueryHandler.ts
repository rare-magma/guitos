import { BudgetFinder } from "@guitos/contexts/budget/application/readBudget/budgetFinder";
import { FindBudgetQueryHandler } from "@guitos/contexts/budget/application/readBudget/findBudgetQueryHandler";
import { LocalForageBudgetRepository } from "@guitos/contexts/budget/infrastructure/localForageBudgetRepository";
import { queryBus } from "@shared/infrastructure/buses";

export function registerFindBudgetQueryHandler() {
  const queryHandler = new FindBudgetQueryHandler(
    new BudgetFinder(new LocalForageBudgetRepository()),
  );

  queryBus.register(queryHandler);
}
