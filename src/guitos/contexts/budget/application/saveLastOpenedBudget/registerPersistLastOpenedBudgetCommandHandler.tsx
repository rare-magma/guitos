import { LastOpenedBudgetPersister } from "@guitos/contexts/budget/application/saveLastOpenedBudget/lastOpenedBudgetPersister";
import { PersistLastOpenedBudgetCommandHandler } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommandHandler";
import { LocalStorageLastOpenedBudgetRepository } from "@guitos/contexts/budget/infrastructure/localStorageLastOpenedBudgetRepository";
import { commandBus } from "@shared/infrastructure/buses";

export function registerPersistLastOpenedBudgetCommandHandler() {
  const persister = new LastOpenedBudgetPersister(
    new LocalStorageLastOpenedBudgetRepository(),
  );
  const commandHandler = new PersistLastOpenedBudgetCommandHandler(persister);

  commandBus.register(commandHandler);
}
