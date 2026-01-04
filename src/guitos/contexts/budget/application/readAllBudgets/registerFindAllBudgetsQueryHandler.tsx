import { BudgetsFinder } from "@guitos/contexts/budget/application/readAllBudgets/allBudgetsFinder";
import { FindAllBudgetsQueryHandler } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQueryHandler";
import { LocalForageBudgetRepository } from "@guitos/contexts/budget/infrastructure/localForageBudgetRepository";
import { queryBus } from "@shared/infrastructure/buses";

export function registerFindAllBudgetsQueryHandler() {
  const queryHandler = new FindAllBudgetsQueryHandler(
    new BudgetsFinder(new LocalForageBudgetRepository()),
  );

  queryBus.register(queryHandler);
}
