import { LastOpenedBudgetFinder } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetFinder";
import { LastOpenedBudgetQueryHandler } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQueryHandler";
import { LocalStorageLastOpenedBudgetRepository } from "@guitos/contexts/budget/infrastructure/localStorageLastOpenedBudgetRepository";
import { queryBus } from "@shared/infrastructure/buses";

export function registerFindLastOpenedBudgetQueryHandler() {
  const queryHandler = new LastOpenedBudgetQueryHandler(
    new LastOpenedBudgetFinder(new LocalStorageLastOpenedBudgetRepository()),
  );

  queryBus.register(queryHandler);
}
