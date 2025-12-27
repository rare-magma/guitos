import { OperationsPersister } from "@guitos/contexts/operations/application/persistOperations/operationsPersister";
import { PersistOperationsCommandHandler } from "@guitos/contexts/operations/application/persistOperations/persistOperationsCommandHandler";
import { LocalForageOperationsRepository } from "@guitos/contexts/operations/infrastructure/localForageOperationsRepository";
import { commandBus, eventBus, queryBus } from "@shared/infrastructure/buses";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function registerPersistOperationsCommandHandler() {
  const changer = new OperationsPersister(
    new CurrentTimeClock(),
    new LocalForageOperationsRepository(),
    eventBus,
    queryBus,
  );
  const commandHandler = new PersistOperationsCommandHandler(changer);

  commandBus.register(commandHandler);
}
