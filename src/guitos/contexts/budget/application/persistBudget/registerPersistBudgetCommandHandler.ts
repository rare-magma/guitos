import { BudgetPersister } from "@guitos/contexts/budget/application/persistBudget/budgetPersister";
import { PersistBudgetCommandHandler } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommandHandler";
import { LocalForageBudgetRepository } from "@guitos/contexts/budget/infrastructure/localForageBudgetRepository";
import { commandBus } from "@shared/infrastructure/buses";

export function registerPersistBudgetCommandHandler() {
  const persister = new BudgetPersister(new LocalForageBudgetRepository());
  const commandHandler = new PersistBudgetCommandHandler(persister);

  commandBus.register(commandHandler);
}
