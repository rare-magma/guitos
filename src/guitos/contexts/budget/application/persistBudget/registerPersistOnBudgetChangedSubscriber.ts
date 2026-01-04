import { PersistBudgetOnBudgetChanged } from "@guitos/contexts/budget/application/persistBudget/persistBudgetOnBudgetChanged";
import { commandBus, eventBus } from "@shared/infrastructure/buses";

export function registerPersistOnBudgetChangedSubscriber() {
  const subscriber = new PersistBudgetOnBudgetChanged(commandBus);

  eventBus.subscribe(subscriber);
}
